import type { AgeGroupKey } from '../types';

export interface AgeCalculationResult {
  exactAge: string;
  ageGroupDisplay: string;
  ageGroupKey: AgeGroupKey | null;
  isPremature: boolean;
  isCorrected: boolean;
}

/**
 * 原生 JS 計算月數差異 (取代 date-fns differenceInMonths)
 */
const getMonthsDiff = (d1: Date, d2: Date) => {
  let months = (d1.getFullYear() - d2.getFullYear()) * 12;
  months -= d2.getMonth();
  months += d1.getMonth();
  // 如果日期還沒到 (例如 15號 vs 20號)，月數減一
  if (d1.getDate() < d2.getDate()) {
    months--;
  }
  return months <= 0 ? 0 : months;
};

/**
 * 原生 JS 計算天數差異 (取代 date-fns differenceInDays)
 */
const getDaysDiff = (d1: Date, d2: Date) => {
  const diffTime = Math.abs(d1.getTime() - d2.getTime());
  // 使用 floor 取代 ceil，避免將 0.5 天算作 1 天
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
};

/**
 * 原生 JS 加天數 (取代 date-fns addDays)
 */
const addDaysToDate = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const calculateAge = (
  birthDateString: string,
  targetDate: Date = new Date(),
  gestationalWeeks: number = 40
): AgeCalculationResult => {
  const birthDate = new Date(birthDateString);
  const isPremature = gestationalWeeks < 37;

  // 1. 計算生理年齡的月數
  const chronoMonths = getMonthsDiff(targetDate, birthDate);
  
  // 2. 決定是否使用矯正年齡
  let calculationDate = birthDate;
  let isCorrected = false;

  // 早產且小於 24 個月 (2歲) 需進行矯正
  // 4-5歲篩檢已超過24個月，因此不會觸發此邏輯，這是正確的
  if (isPremature && chronoMonths < 24) {
    const weeksToCorrect = 40 - gestationalWeeks;
    calculationDate = addDaysToDate(birthDate, weeksToCorrect * 7);
    isCorrected = true;
  }

  // 3. 基於(可能矯正後的)日期計算精確年齡
  const totalMonths = getMonthsDiff(targetDate, calculationDate);
  const totalDays = getDaysDiff(targetDate, calculationDate);

  // 計算顯示用的歲與月
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  // 剩餘天數估算 (僅用於顯示，不需要非常精確)
  const days = totalDays % 30; 

  let exactAge = '';
  if (years > 0) exactAge += `${years}歲`;
  if (months > 0) exactAge += ` ${months}個月`;
  if (years === 0 && months === 0) exactAge += ` ${days}天`;
  if (isCorrected) exactAge += ' (矯正)';

  // 4. 判斷 AgeGroupKey
  let ageGroupKey: AgeGroupKey | null = null;
  let ageGroupDisplay = '不在篩檢年齡範圍';

  if (totalMonths >= 6 && totalMonths < 9) {
    ageGroupKey = '6-9m';
    ageGroupDisplay = '6個月 - 9個月';
  } else if (totalMonths >= 9 && totalMonths < 12) {
    ageGroupKey = '9-12m';
    ageGroupDisplay = '9個月 - 12個月';
  } else if (totalMonths >= 12 && totalMonths < 15) {
    ageGroupKey = '12-15m';
    ageGroupDisplay = '12個月 - 15個月';
  } else if (totalMonths >= 15 && totalMonths < 18) {
    ageGroupKey = '15-18m';
    ageGroupDisplay = '15個月 - 18個月';
  } else if (totalMonths >= 18 && totalMonths < 24) {
    ageGroupKey = '18-24m';
    ageGroupDisplay = '18個月 - 24個月';
  } else if (totalMonths >= 24 && totalMonths < 36) {
    ageGroupKey = '2-3y';
    ageGroupDisplay = '2歲 - 3歲';
  } else if (totalMonths >= 36 && totalMonths < 48) {
    ageGroupKey = '3-4y';
    ageGroupDisplay = '3歲 - 4歲';
  } else if (totalMonths >= 48 && totalMonths < 60) {
    // ✅ 4-5歲判斷區塊 (已確認)
    // 對應 PDF 量表八：4歲至未滿5歲
    ageGroupKey = '4-5y';
    ageGroupDisplay = '4歲 - 5歲';
  } else if (totalMonths >= 60 && totalMonths < 84) {
    // ✅ 5-7歲判斷區塊 (已確認)
    // 對應 PDF 量表九：5歲至未滿7歲 (PDF [cite: 564, 611])
    ageGroupKey = '5-7y';
    ageGroupDisplay = '5歲 - 7歲';
  }

  return {
    exactAge,
    ageGroupDisplay,
    ageGroupKey,
    isPremature,
    isCorrected
  };
};