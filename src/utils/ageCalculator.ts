import type { AgeGroupKey } from '../types';

export interface AgeCalculationResult {
  exactAge: string;
  ageGroupDisplay: string;
  ageGroupKey: AgeGroupKey | null;
  isPremature: boolean;
  isCorrected: boolean;
}

// 定義常數，避免 Magic Number
const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * 原生 JS 計算月數差異 (取代 date-fns differenceInMonths)
 * 邏輯：計算「足月」數。
 */
const getMonthsDiff = (target: Date, birth: Date) => {
  let months = (target.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += target.getMonth();
  // 如果日期還沒到 (例如 15號 vs 20號)，月數減一
  if (target.getDate() < birth.getDate()) {
    months--;
  }
  return months <= 0 ? 0 : months;
};

/**
 * 原生 JS 計算天數差異
 * ✅ 優化：移除 Math.abs，避免掩蓋「未來日期」的錯誤輸入
 */
const getDaysDiff = (target: Date, birth: Date) => {
  const diffTime = target.getTime() - birth.getTime();
  // 若出生日期在未來 (diffTime < 0)，回傳 0，不計算負數
  return diffTime <= 0 ? 0 : Math.floor(diffTime / DAY_MS); 
};

/**
 * 原生 JS 加天數
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

  // 1. 計算生理年齡的月數 (用於判斷是否需要矯正)
  const chronoMonths = getMonthsDiff(targetDate, birthDate);
  
  // ✅ 優化 1: 提取業務邏輯變數，提升可讀性
  // 早產且生理年齡小於 24 個月 (2歲) 需進行矯正
  const needsCorrection = isPremature && chronoMonths < 24;

  // 2. 決定計算基準日
  let calculationDate = birthDate;
  let isCorrected = false;

  if (needsCorrection) {
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
  // 剩餘天數估算 (僅用於顯示 UI)
  const days = totalDays % 30; 

  // 組裝顯示字串
  let exactAge = '';
  if (years > 0) {
    exactAge += `${years}歲`;
    if (months > 0) exactAge += ` ${months}個月`;
  } else {
    // 不滿 1 歲
    if (months > 0) exactAge += `${months}個月`;
    if (months === 0 || days > 0) exactAge += ` ${days}天`;
  }
  
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
    ageGroupKey = '4-5y';
    ageGroupDisplay = '4歲 - 5歲';
  } else if (totalMonths >= 60 && totalMonths < 84) {
    ageGroupKey = '5-7y';
    ageGroupDisplay = '5歲 - 7歲';
  }

  return {
    exactAge: exactAge.trim(),
    ageGroupDisplay,
    ageGroupKey,
    isPremature,
    isCorrected
  };
};