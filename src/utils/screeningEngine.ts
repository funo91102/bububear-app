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
  return (data?.gross_motor?.questions?.length ?? 0) > 0;
};

/**
 * 自動取得所有「已開放」的年齡層列表
 * ✅ 優化 1: 回傳型別精確化為 AgeGroupKey[]
 */
export const getImplementedAgeGroups = (): AgeGroupKey[] => {
  const allKeys = Object.keys(screeningData) as AgeGroupKey[];
  return allKeys.filter(isAgeGroupImplemented);
};

// =========================================================================
// 🚀 核心計分引擎
// =========================================================================

/**
 * 動態計算特定領域的滿分
 * 因為資料庫移除了 maxScore 欄位，現在必須依據題目權重動態計算
 */
export const getDomainMaxScore = (ageGroup: AgeGroupKey, domainKey: DomainKey): number => {
  const domainData = screeningData[ageGroup]?.[domainKey];
  if (!domainData) return 0;

  // 加總所有題目的權重 (若無設定 weight，預設為 1)
  return domainData.questions.reduce((total, q) => total + (q.weight || 1), 0);
};

// ✅ 優化 2: 集中定義「通過值集合」，提升維護性與效能
const PASSING_VALUES = new Set<RawAnswerValue>([
  'pass', 
  'max', 
  true, 
  1, 
  '1'
]);

/**
 * 統一判斷單題是否通過
 */
export const isPassingAnswer = (answer: RawAnswerValue): boolean => {
  return PASSING_VALUES.has(answer);
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
  
  // 初始化預設結果容器 (Fail-safe defaults)
  const domainScores: Record<DomainKey, number> = {
    gross_motor: 0,
    fine_motor: 0,
    cognitive_language: 0,
    social: 0
  };

  const domainStatuses: Record<DomainKey, AssessmentStatus> = {
    gross_motor: 'pass',
    fine_motor: 'pass',
    cognitive_language: 'pass',
    social: 'pass'
  };

  // ✅ 優化 3: 資料防呆 (Guard Clause)
  // 若該年齡層資料不存在，直接回傳安全預設值，避免程式崩潰
  if (!ageData) {
    console.error(`[ScreeningEngine] Critical: Missing data for age group ${ageGroupKey}`);
    return {
      domainScores,
      domainStatuses,
      overallStatus: 'normal',
      totalScore: 0
    };
  }

  let totalScore = 0;
  let failCount = 0;
  let maxCount = 0;  // 🆕 新增：計算有幾個面向是滿分
  let validDomainCount = 0;  // 🆕 新增：計算有效面向數量（排除空殼）

  // 遍歷四個領域進行計算
  const domains: DomainKey[] = ['gross_motor', 'fine_motor', 'cognitive_language', 'social'];

  domains.forEach(domainKey => {
    const domain = ageData[domainKey];
    if (!domain) return; // 單一領域防呆

    // [關鍵邏輯]：先確認該面向是否有題目 (滿分是否 > 0)
    // 對於 6-9m 的 'social' (空殼)，maxScore 會是 0
    const maxScore = getDomainMaxScore(ageGroupKey, domainKey);

    if (maxScore === 0) {
      // 若滿分為 0，代表此年齡層無此面向 (或已合併)，直接跳過計算
      // 狀態維持預設的 'pass'，且不計入 failCount 和 validDomainCount
      return; 
    }

    // 🆕 修正：只計算有題目的面向
    validDomainCount++;

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
      if (currentScore === maxScore) {
        domainStatuses[domainKey] = 'max';
        maxCount++;  // 🆕 新增：計數滿分面向
      } else {
        domainStatuses[domainKey] = 'pass';
      }
    } else {
      domainStatuses[domainKey] = 'fail';
      failCount++; // 只有真正存在的面向未達標，才計入失敗
    }
  });

  // 3. 決定總體狀態 (Overall Status) 邏輯
  // 🆕 修正：優先順序調整，先判斷是否有未達標
  let overallStatus: 'normal' | 'follow_up' | 'referral' | 'great' = 'normal';

  // 🔧 優先判斷：是否有面向未達標？（最重要）
  if (failCount >= 2) {
    overallStatus = 'referral';  // 兩個或以上領域未達標 → 建議轉介
  } else if (failCount === 1) {
    overallStatus = 'follow_up';  // 只有一個領域未達標 → 需追蹤
  }
  // 🔧 其次判斷：沒有未達標的情況下，是否全部滿分？
  else if (validDomainCount > 0 && maxCount === validDomainCount) {
    overallStatus = 'great';  // 所有有效面向都滿分 → 太棒了！
  }
  // 🔧 最後：全部及格但非全滿分
  else {
    overallStatus = 'normal';  // 全部及格但非全部滿分 → 如期達標
  }

  console.log('🔍 Debug:', {
    failCount,
    maxCount, 
    validDomainCount,
    overallStatus
  });
  
  return {
    domainScores,
    domainStatuses,
    overallStatus,
    totalScore
  };
};