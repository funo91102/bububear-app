import { validateScreeningDataIntegrity } from './dataValidator';

/**
 * 執行開發環境專屬的檢查流程
 * 包含：資料完整性校驗 (Data Integrity Check)
 */
export function runDevDataChecks() {
  // ✅ 使用標準的 Vite 環境變數檢查 (需配合 vite-env.d.ts)
  if (import.meta.env.DEV) {
    console.log('🔧 [Dev] 正在執行資料完整性校驗...');
    
    // 設定 throwOnError: false，只印出紅字錯誤但不卡住 App
    validateScreeningDataIntegrity({ throwOnError: false });
  }
}