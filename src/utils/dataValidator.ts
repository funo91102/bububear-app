import { screeningData } from '../constants/screeningData';
import { DomainKey, AgeGroupKey } from '../types';

/**
 * 資料校驗回傳介面
 */
interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 驗證資料庫完整性 (SSOT 醫療級版本)
 *
 * 設計原則：
 * - DEV：完整檢查 + 明確錯誤提示，但不中斷 React render
 * - PROD：嚴格 fail-fast，任何 errors 直接 throw
 *
 * 驗證項目：
 * 1. 題目 ID 全域唯一性
 * 2. 權重與切截點數值合法性
 * 3. 年齡層 × 面向結構完整性
 */
export const validateScreeningDataIntegrity = (
  { throwOnError }: { throwOnError?: boolean } = {}
): ValidationResult => {

  const errors: string[] = [];
  const warnings: string[] = [];

  const isProd = import.meta.env.PROD;
  const shouldThrow = throwOnError ?? isProd;

  // 全域題目 ID 檢查
  const globalQuestionIdSet = new Set<string>();

  const requiredDomains: DomainKey[] = [
    'gross_motor',
    'fine_motor',
    'cognitive_language',
    'social'
  ];

  (Object.keys(screeningData) as AgeGroupKey[]).forEach(ageKey => {
    const ageData = screeningData[ageKey];

    if (!ageData) {
      errors.push(`[${ageKey}] 年齡層資料缺失`);
      return;
    }

    requiredDomains.forEach(domainKey => {
      const domain = ageData[domainKey];

      // 檢查 1：面向是否存在
      if (!domain) {
        errors.push(`[${ageKey}] 缺少面向: ${domainKey}`);
        return;
      }

      // 檢查 2：Domain 顯示名稱
      if (!domain.name || typeof domain.name !== 'string') {
        warnings.push(
          `[顯示問題] ${ageKey} - ${domainKey}: 缺少可讀名稱 (domain.name)`
        );
      }

      // 檢查 3：是否有題目
      if (!domain.questions || domain.questions.length === 0) {
        if (ageKey === '5-7y') {
          warnings.push(
            `[建置中] ${ageKey} ${domain.name} (${domainKey}) 尚未建置題目`
          );
        } else {
          errors.push(
            `[${ageKey}] ${domain.name} (${domainKey}) 沒有題目`
          );
        }
        // ⚠️ 不 return，允許後續結構繼續被檢查
        return;
      }

      let totalWeight = 0;

      domain.questions.forEach(q => {
        // 檢查 A：題目 ID 唯一性（致命）
        if (globalQuestionIdSet.has(q.id)) {
          errors.push(
            `[ID 重複致命錯誤] 題目 ID "${q.id}" 重複出現（${ageKey} - ${domain.name}）`
          );
        } else {
          globalQuestionIdSet.add(q.id);
        }

        // 檢查 B：權重合法性
        if (q.weight !== undefined) {
          if (typeof q.weight !== 'number' || isNaN(q.weight)) {
            errors.push(
              `[數值錯誤] ${ageKey} - ${domain.name}: 題目 ${q.id} 權重無效 (${q.weight})`
            );
          } else if (q.weight <= 0) {
            warnings.push(
              `[權重異常] ${ageKey} - ${domain.name}: 題目 ${q.id} 權重為 ${q.weight}（應為正整數）`
            );
          }
        }

        totalWeight += q.weight ?? 1;
      });

      // 檢查 4：切截點邏輯
      if (typeof domain.cutoff !== 'number') {
        errors.push(
          `[型別錯誤] ${ageKey} - ${domain.name}: cutoff 不是數字`
        );
      } else {
        if (!Number.isInteger(domain.cutoff)) {
          warnings.push(
            `[臨床邏輯] ${ageKey} - ${domain.name}: cutoff 應為整數 (${domain.cutoff})`
          );
        }

        if (domain.cutoff > totalWeight) {
          errors.push(
            `[邏輯錯誤] ${ageKey} - ${domain.name}: 切截點 (${domain.cutoff}) 高於總分 (${totalWeight})`
          );
        }
      }
    });
  });

  const result: ValidationResult = {
    ok: errors.length === 0,
    errors,
    warnings
  };

  // === 統一輸出區 ===

  if (!result.ok) {
    console.group('❌ 步步熊資料校驗失敗');
    errors.forEach(e => console.error(e));
    console.groupEnd();

    if (shouldThrow) {
      throw new Error('Screening Data Integrity Check Failed');
    }
  }

  if (warnings.length > 0) {
    console.group('⚠️ 資料校驗警告（非致命）');
    warnings.forEach(w => console.warn(w));
    console.groupEnd();
  }

  if (result.ok && warnings.length === 0) {
    console.log('✅ 步步熊資料校驗通過（SSOT Mode）');
  }

  return result;
};
