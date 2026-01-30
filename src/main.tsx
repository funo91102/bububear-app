import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ✅ 引入抽離後的驗證工具
import { validateScreeningDataIntegrity } from './utils/dataValidator';

// ✅ 僅在開發環境 (Development) 執行資料校驗
// 這能確保在開發階段即時發現 ID 重複或資料缺漏的問題，但不會影響正式版效能
if (import.meta.env.DEV) {
  console.log('🔧 [Dev] 正在執行資料完整性校驗...');
  
  // 設定 throwOnError: false，只印出紅字錯誤但不卡住 App
  // 若資料庫結構更動頻繁，建議改為 true 以強制修正
  validateScreeningDataIntegrity({ throwOnError: false });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);