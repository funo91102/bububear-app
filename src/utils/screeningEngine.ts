import { screeningData } from '../constants/screeningData';
import type { 
  AgeGroupKey, 
  DomainKey, 
  Answers, 
  AssessmentResult, 
  AssessmentStatus,
  RawAnswerValue
} from '../types';

// =========================================================================
// 1. 輔助判定與型別安全
// =========================================================================

/**
 * 檢查該年齡層是否已建置資料
 * 優化：改為檢查「任一領域是否有題目」，不綁定特定領域，提升擴充性。
 */
export const isAgeGroupImplemented = (ageKey: AgeGroupKey | undefined | null): boolean => {
  if (!ageKey) return false;
  
  const data = screeningData[ageKey];
  if (!data) return false;

  // 取得該年齡層所有領域的資料，檢查是否有任何領域包含題目
  return Object.values(data).some(domain => (domain.questions?.length ?? 0) > 0);
};

/**
 * 自動取得所有「已開放」的年齡層列表
 * 優化：回傳精確的 AgeGroupKey[] 型別，提升 DX (開發者體驗)。
 */
export const getImplementedAgeGroups = (): AgeGroupKey[] => {
  const allKeys = Object.keys(screeningData) as AgeGroupKey[];
  return allKeys.filter(isAgeGroupImplemented);
};

// =========================================================================
// 2. 核心計分邏輯
// =========================================================================

/**
 * 通過標準的集合 (Declarative Style)
 * 集中管理所有視為「通過」的值，易於維護。
 */
const PASS_VALUES = new Set<RawAnswerValue>(['pass', 'max', true, 1, '1']);

/**
 * 統一判斷單題是否通過
 */
export const isPassingAnswer = (answer: RawAnswerValue): boolean => {
  return PASS_VALUES.has(answer);
};

/**
 * 動態計算特定領域的滿分
 * 保持 Pure Function，暫不引入 Cache 以維持無狀態的單純性。
 */
export const getDomainMaxScore = (ageGroup: AgeGroupKey, domainKey: DomainKey): number => {
  const domainData = screeningData[ageGroup]?.[domainKey];
  if (!domainData) return 0;

  // 加總所有題目的權重 (若無設定 weight，預設為 1)
  return domainData.questions.reduce((total, q) => total + (q.weight || 1), 0);
};

/**
 * 核心評估引擎
 * 根據使用者的回答計算最終結果 (分數、狀態、總評)
 */
export const calculateAssessmentResult = (
  ageGroupKey: AgeGroupKey,
  answers: Answers
): AssessmentResult => {
  const ageData = screeningData[ageGroupKey];

  // 初始化結果容器
  const domainScores: Record<DomainKey, number> = {
    gross_motor: 0,
    fine_motor: 0,
    cognitive_language: 0,
    social: 0
  };

  const domainStatuses: Record<DomainKey, AssessmentStatus> = {
    gross_motor: 'fail',
    fine_motor: 'fail',
    cognitive_language: 'fail',
    social: 'fail'
  };

  // 🛡️ 防呆保護：若 ageData 不存在 (例如 URL 參數被亂改)，回傳安全預設值，避免 Crash
  if (!ageData) {
    console.error(`Screening Engine Error: Age group "${ageGroupKey}" data not found.`);
    return {
      domainScores,
      domainStatuses,
      overallStatus: 'referral', // 預設為異常以引起注意，或可改為 normal 並顯示錯誤提示
      totalScore: 0
    };
  }

  let totalScore = 0;
  let failCount = 0;       // 未達 Cutoff 的領域數量
  let notFullScoreCount = 0; // 達 Cutoff 但未滿分的領域數量

  // 遍歷四個領域進行計算
  const domains: DomainKey[] = ['gross_motor', 'fine_motor', 'cognitive_language', 'social'];

  domains.forEach(domainKey => {
    const domain = ageData[domainKey];
    if (!domain) return; // 防呆

    let currentScore = 0;
    
    // 1. 計算該領域得分
    domain.questions.forEach(q => {
      const answer = answers[q.id];
      if (isPassingAnswer(answer)) {
        currentScore += (q.weight || 1);
      }
    });

    domainScores[domainKey] = currentScore;
    totalScore += currentScore;

    // 2. 判斷該領域狀態
    const maxScore = getDomainMaxScore(ageGroupKey, domainKey);
    
    // 若得分 >= 切截點 (Cutoff)，則通過
    if (currentScore >= domain.cutoff) {
      if (currentScore === maxScore) {
        domainStatuses[domainKey] = 'max'; // 滿分 (白色區)
      } else {
        domainStatuses[domainKey] = 'pass'; // 通過但未滿分 (淺灰色區)
        notFullScoreCount++;
      }
    } else {
      domainStatuses[domainKey] = 'fail'; // 未通過 (深灰色區)
      failCount++;
    }
  });

  // 3. 決定總體狀態 (Overall Status) 邏輯
  // 依據 PDF 評估結果表
  // - Fail >= 1 -> Referral (需轉介) - 高敏感度篩檢原則
  // - NotFullScore >= 1 -> Normal (需追蹤)
  // - All Max -> Great (太棒了)

  let overallStatus: 'great' | 'normal' | 'referral' = 'great';

  if (failCount > 0) {
    overallStatus = 'referral';
  } else if (notFullScoreCount > 0) {
    overallStatus = 'normal'; 
  } else {
    overallStatus = 'great';
  }

  return {
    domainScores,
    domainStatuses,
    overallStatus,
    totalScore
  };
};