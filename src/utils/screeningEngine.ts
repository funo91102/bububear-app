import { screeningData } from '../constants/screeningData';
import type { AgeGroupKey, DomainKey } from '../types';

/**
 * 檢查該年齡層是否已建置資料
 * 判斷標準：粗大動作 (gross_motor) 的題目數量是否大於 0
 * * 🔍 Debug 提示：如果這裡回傳 false，請檢查 screeningData.ts 中該年齡層的資料是否已正確填入
 */
export const isAgeGroupImplemented = (ageKey: AgeGroupKey | undefined | null): boolean => {
  if (!ageKey) return false;
  
  const data = screeningData[ageKey];
  
  // 安全檢查：確認資料存在，且粗大動作有題目
  // 使用 ?. 運算子防止 undefined 錯誤
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
// 🚀 核心計分引擎 (已修正：支援字串轉數字邏輯)
// =========================================================================

/**
 * 計算單一面向的總分 (含加權邏輯)
 * @param ageGroup 年齡層
 * @param domain 面向 (例如 gross_motor)
 * @param answers 使用者的回答紀錄 { questionId: 'pass' | 'fail' | ... }
 */
export const calculateDomainScore = (
  ageGroup: AgeGroupKey,
  domain: DomainKey,
  answers: Record<string, string | undefined> // ✅ 修正：接收 App 實際儲存的字串格式
): number => {
  // 1. 取得該面向的所有題目，若無則回傳空陣列
  const questions = screeningData[ageGroup]?.[domain]?.questions || [];

  // 2. 累加分數
  return questions.reduce((total, q) => {
    const status = answers[q.id]; 
    
    // ✅ 關鍵修正：將狀態字串轉換為分數
    // 只有 'pass' (通過) 或 'max' (滿分) 才算分
    // 'fail', 'refused', 'doctor_assessment' 都不算分 (或視為 0)
    const userValue = (status === 'pass' || status === 'max') ? 1 : 0;
    
    // 取得權重 (預設為 1，星星題通常為 2，依據 screeningData 設定)
    const weight = q.weight || 1;
    
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
  
  // 若找不到該面向的資料 (例如切截點)，回傳 unknown
  if (!domainData) return 'unknown';

  // 比較總分與切截點 (Cutoff)
  // 若 score >= cutoff 則通過
  return score >= domainData.cutoff ? 'pass' : 'fail';
};