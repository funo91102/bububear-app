import { screeningData } from '../constants/screeningData';
import type { AgeGroupKey } from '../types';

/**
 * 檢查該年齡層是否已建置資料
 * 判斷標準：粗大動作 (gross_motor) 的題目數量是否大於 0
 * @param ageKey - 嚴格限制為 AgeGroupKey 型別，杜絕 string typo
 */
export const isAgeGroupImplemented = (ageKey: AgeGroupKey | undefined | null): boolean => {
  if (!ageKey) return false;
  const data = screeningData[ageKey];
  // 檢查該年齡層是否存在，且粗大動作有題目
  return (data?.gross_motor?.questions?.length ?? 0) > 0;
};

/**
 * ✨ New: 自動取得所有「已開放」的年齡層列表
 * 用途：顯示在「建置中」頁面，告訴使用者哪些可以測
 */
export const getImplementedAgeGroups = (): string[] => {
  // 1. 取得所有 Key
  const allKeys = Object.keys(screeningData) as AgeGroupKey[];
  
  // 2. 過濾出已實作的 Key
  return allKeys.filter(isAgeGroupImplemented);
};