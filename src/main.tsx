import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ✅ 引入封裝後的開發檢查工具
import { runDevDataChecks } from './utils/devChecks';

// 🚀 啟動開發環境檢查 (僅在 dev 模式下會執行內部邏輯)
runDevDataChecks();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);