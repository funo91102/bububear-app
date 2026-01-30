// src/utils/dataValidator.ts
import { screeningData } from '../constants/screeningData';

// ✅ 本地定義型別，確保 validator 獨立運作，不受外部型別匯出影響
type DomainKey = 'gross_motor' | 'fine_motor' | 'cognitive_language' | 'social';

/**
 * 資料完整性與邏輯校驗
 * 執行項目：
 * 1. 分數總和檢查 (確保題目權重加總 = 該領域滿分)
 * 2. 門檻邏輯檢查 (確保通過門檻 <= 滿分)
 * 3. ID 唯一性檢查 (避免題目 ID 重複導致答案被覆蓋)
 * * @param options.throwOnError - 若為 true，檢測失敗時會拋出 Error (建議僅在開發環境開啟)
 */
export const validateScreeningDataIntegrity = (options?: {
  throwOnError?: boolean;
}) => {
  const errors: string[] = [];
  const allQuestionIds = new Set<string>(); // 用來追蹤所有出現過的 ID

  Object.entries(screeningData).forEach(([ageKey, ageData]) => {
    
    (['gross_motor', 'fine_motor', 'cognitive_language', 'social'] as DomainKey[])
      .forEach((domainKey) => {
        // 使用 as any 繞過 TS 索引檢查，保持程式碼簡潔
        const domain = (ageData as any)[domainKey];
        
        // 略過未定義或沒有題目的空資料
        if (!domain || !domain.questions || domain.questions.length === 0) return;

        // --- 1. 計算權重總分 ---
        const calculatedMaxScore = domain.questions.reduce(
          (sum: number, q: any) => sum + (q.weight || 0),
          0
        );

        // 檢核：總分一致性
        if (calculatedMaxScore !== domain.maxScore) {
          errors.push(
            `[分數不符] ${ageKey} - ${domain.name} (${domainKey}): ` +
            `設定滿分=${domain.maxScore}, 題目權重總和=${calculatedMaxScore}`
          );
        }

        // 檢核：門檻合理性
        if (domain.cutoff > calculatedMaxScore) {
          errors.push(
            `[門檻錯誤] ${ageKey} - ${domain.name}: 通過門檻 (${domain.cutoff}) 不應大於滿分 (${calculatedMaxScore})`
          );
        }

        // --- 2. ID 唯一性檢查 (關鍵！) ---
        domain.questions.forEach((q: any) => {
          if (!q.id) {
             errors.push(`[ID 遺失] ${ageKey} - ${domain.name}: 發現沒有 ID 的題目 "${q.text?.substring(0, 10)}..."`);
          } else if (allQuestionIds.has(q.id)) {
             errors.push(`[ID 重複] ${ageKey} - ${domain.name}: ID "${q.id}" 已被使用過，這會導致答案存檔錯誤！`);
          } else {
             allQuestionIds.add(q.id);
          }
        });
      });
  });

  // 輸出結果
  if (errors.length > 0) {
    console.group('❌ 步步熊資料校驗失敗');
    errors.forEach(err => console.error(err));
    console.groupEnd();

    if (options?.throwOnError) {
      throw new Error('Screening data validation failed. Check console for details.');
    }
  } else {
    console.log(`✅ 步步熊資料校驗通過：共檢查 ${allQuestionIds.size} 題，數據邏輯與 ID 皆正常。`);
  }

  return errors;
};