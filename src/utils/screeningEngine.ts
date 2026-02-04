import { screeningData } from '../constants/screeningData';
import type { 
  AgeGroupKey, 
  DomainKey, 
  Answers, 
  AssessmentResult, 
  AssessmentStatus,
  RawAnswerValue
} from '../types';

/**
 * 檢查該年齡層是否已建置資料
 * 判斷標準：粗大動作 (gross_motor) 的題目數量是否大於 0
 */
export const isAgeGroupImplemented = (ageKey: AgeGroupKey | undefined | null): boolean => {
  if (!ageKey) return false;
  
  const data = screeningData[ageKey];
  // 安全檢查：確認資料存在，且粗大動作有題目
  const hasQuestions = (data?.gross_motor?.questions?.length ?? 0) > 0;
  
  return hasQuestions;
};

/**
 * 自動取得所有「已開放」的年齡層列表
 * 用途：顯示在「建置中」頁面，告訴使用者哪些可以測
 */
export const getImplementedAgeGroups = (): string[] => {
  const allKeys = Object.keys(screeningData) as AgeGroupKey[];
  return allKeys.filter(isAgeGroupImplemented);
};

// =========================================================================
// 🚀 核心計分引擎
// =========================================================================

/**
 * ✅ [關鍵修復] 動態計算特定領域的滿分
 * 因為資料庫移除了 maxScore 欄位，現在必須依據題目權重動態計算
 */
export const getDomainMaxScore = (ageGroup: AgeGroupKey, domainKey: DomainKey): number => {
  const domainData = screeningData[ageGroup]?.[domainKey];
  if (!domainData) return 0;

  // 加總所有題目的權重 (若無設定 weight，預設為 1)
  return domainData.questions.reduce((total, q) => total + (q.weight || 1), 0);
};

/**
 * 統一判斷單題是否通過
 * 支援: 'pass', 'max', true, 1, '1'
 */
export const isPassingAnswer = (answer: RawAnswerValue): boolean => {
  if (answer === 'pass' || answer === 'max') return true;
  if (answer === true) return true;
  if (answer === 1 || answer === '1') return true;
  return false;
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

  let totalScore = 0;
  let failCount = 0;

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
    // 若得分 >= 切截點 (Cutoff)，則通過
    if (currentScore >= domain.cutoff) {
      // 進一步判斷是否滿分 (顯示星星或MAX)
      const maxScore = getDomainMaxScore(ageGroupKey, domainKey);
      domainStatuses[domainKey] = (currentScore === maxScore) ? 'max' : 'pass';
    } else {
      domainStatuses[domainKey] = 'fail';
      failCount++;
    }
  });

  // 3. 決定總體狀態 (Overall Status)邏輯
  let overallStatus: 'normal' | 'follow_up' | 'referral' = 'normal';

  if (failCount === 0) {
    overallStatus = 'normal';
  } else if (failCount === 1) {
    overallStatus = 'follow_up'; // 只有一個領域未達標 -> 需追蹤
  } else {
    overallStatus = 'referral';  // 兩個或以上領域未達標 -> 建議轉介
  }

  return {
    domainScores,
    domainStatuses,
    overallStatus,
    totalScore
  };
};