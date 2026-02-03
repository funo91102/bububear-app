import { screeningData } from '../constants/screeningData';
import type { AgeGroupKey, DomainKey } from '../types';

/**
 * 檢查該年齡層是否已建置資料
 * 判斷標準：粗大動作 (gross_motor) 的題目數量是否大於 0
 */
export const isAgeGroupImplemented = (ageKey: AgeGroupKey | undefined | null): boolean => {
  if (!ageKey) return false;
  const data = screeningData[ageKey];
  // 檢查該年齡層是否存在，且粗大動作有題目
  return (data?.gross_motor?.questions?.length ?? 0) > 0;
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
// 🚀 新增：核心計分引擎 (針對 15-18m 加權題設計)
// =========================================================================

/**
 * 計算單一面向的總分 (含加權邏輯)
 * @param ageGroup 年齡層
 * @param domain 面向 (例如 gross_motor)
 * @param answers 使用者的回答紀錄 { questionId: value }
 */
export const calculateDomainScore = (
  ageGroup: AgeGroupKey,
  domain: DomainKey,
  answers: Record<string, number>
): number => {
  // 1. 取得該面向的所有題目
  const questions = screeningData[ageGroup]?.[domain]?.questions || [];

  // 2. 累加分數
  return questions.reduce((total, q) => {
    const userValue = answers[q.id] || 0; // 0 或 1
    const weight = q.weight || 1;         // 預設權重為 1，星星題為 2
    return total + (userValue * weight);
  }, 0);
};

/**
 * 取得評估結果 (通過 / 不通過 / 資料不足)
 * @param ageGroup 年齡層
 * @param domain 面向
 * @param score 計算後的總分
 */
export const getEvaluationResult = (
  ageGroup: AgeGroupKey,
  domain: DomainKey,
  score: number
): 'pass' | 'fail' | 'unknown' => {
  const domainData = screeningData[ageGroup]?.[domain];
  
  if (!domainData) return 'unknown';

  // 比較總分與切截點 (Cutoff)
  // 若 score >= cutoff 則通過
  return score >= domainData.cutoff ? 'pass' : 'fail';
};