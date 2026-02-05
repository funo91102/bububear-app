/// <reference types="vite/client" />
import { validateScreeningDataIntegrity } from './dataValidator';

/**
 * 執行開發環境專屬的檢查流程
 * * 包含：資料完整性校驗 (Data Integrity Check)
 */
export function runDevDataChecks() {
  // ✅ 使用標準的 Vite 環境變數檢查
  if (import.meta.env.DEV) {
    console.log('🔧 [Dev] 正在執行資料完整性校驗...');

    // 呼叫驗證函數
    const result = validateScreeningDataIntegrity({ throwOnError: false });
    
    // 如果有嚴重錯誤，可以在這裡決定是否要彈出 alert 或阻擋操作 (目前僅 log)
    if (!result.ok) {
        console.error(`檢測到 ${result.errors.length} 個嚴重資料錯誤，請查看 Console。`);
    }
  }
}