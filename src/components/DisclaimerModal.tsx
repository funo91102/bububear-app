import React, { useState, useEffect } from 'react';
import { AlertCircleIcon, CheckIcon } from './Icons';

interface DisclaimerModalProps {
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // 檢查是否已經滾動到底部
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  // 防止背景滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* 標題區 */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircleIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">使用前重要聲明</h2>
              <p className="text-xs text-slate-500 font-medium">請仔細閱讀以下內容</p>
            </div>
          </div>
        </div>

        {/* 內容區（可滾動） */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4 text-sm leading-relaxed"
          onScroll={handleScroll}
        >
          {/* 一、本系統性質 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-base">📋</span>
              一、本系統性質
            </h3>
            <p className="text-slate-600">
              本系統是基於<strong className="text-slate-800">衛生福利部國民健康署「兒童發展篩檢量表」</strong>所開發的
              <strong className="text-emerald-600">預習與參考工具</strong>，目的是協助家長在就醫前了解篩檢內容，
              減輕孩童對陌生環境的焦慮。
            </p>
          </div>

          {/* 二、醫療責任聲明 */}
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
            <h3 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
              <span className="text-base">⚠️</span>
              二、醫療責任聲明
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span>
                <span>本系統<strong className="text-rose-700">非醫療診斷工具</strong>，篩檢結果僅供參考</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span>
                <span>任何發展疑慮請務必<strong className="text-rose-700">諮詢專業醫師</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span>
                <span><strong className="text-rose-700">不得以本系統結果</strong>作為醫療決策依據</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span>
                <span>本系統<strong className="text-rose-700">無法取代</strong>正式的醫療評估</span>
              </li>
            </ul>
          </div>

          {/* 三、授權與資料來源 */}
          <div className="bg-sky-50 p-4 rounded-xl border border-sky-200">
            <h3 className="font-bold text-sky-800 mb-2 flex items-center gap-2">
              <span className="text-base">📚</span>
              三、授權與資料來源
            </h3>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-sky-500">•</span>
                <span><strong>量表內容來源：</strong>衛生福利部國民健康署</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-500">•</span>
                <span><strong>授權狀態：</strong>申請中</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-500">•</span>
                <span><strong>圖卡來源：</strong>衛福部標準化圖卡</span>
              </li>
            </ul>
          </div>

          {/* 四、隱私保護 */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
              <span className="text-base">🔒</span>
              四、隱私保護
            </h3>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">•</span>
                <span>本系統<strong className="text-emerald-700">不會儲存</strong>您的個人資料</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">•</span>
                <span>所有評估過程<strong className="text-emerald-700">僅在您的裝置</strong>上進行</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">•</span>
                <span>我們<strong className="text-emerald-700">不會收集</strong>可識別身份的資訊</span>
              </li>
            </ul>
          </div>

          {/* 五、醫師的話 */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-xl border-2 border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-xl">👨‍⚕️</span>
              醫師的話
            </h3>
            <div className="text-slate-700 space-y-2 text-[13px] leading-relaxed">
              <p>
                身為兒科醫師，我開發這個工具的初衷是：
              </p>
              <ul className="space-y-1.5 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>讓家長在就醫前了解篩檢內容</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>減少孩童對陌生環境的焦慮</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>協助家長在診間更順利配合評估</span>
                </li>
              </ul>
              <p className="mt-3 pt-3 border-t border-slate-200 font-medium text-slate-800">
                但請記得：<strong className="text-rose-600">每個孩子的發展節奏都不同</strong>，
                篩檢只是「初步觀察」不是「最終判斷」。專業評估需要考慮更多因素。
              </p>
              <p className="text-slate-600 italic mt-2">
                有任何疑問，請帶孩子來門診，讓我們一起關心寶貝的成長！
              </p>
            </div>
          </div>

          {/* 滾動提示（未到底時顯示） */}
          {!hasScrolledToBottom && (
            <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-8 pb-2 text-center animate-bounce">
              <p className="text-xs text-slate-400 font-bold">
                ↓ 請滾動至底部以繼續 ↓
              </p>
            </div>
          )}
        </div>

        {/* 底部同意區 */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <label className="flex items-start gap-3 mb-4 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                disabled={!hasScrolledToBottom}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                isChecked 
                  ? 'bg-emerald-500 border-emerald-500' 
                  : hasScrolledToBottom
                  ? 'border-slate-300 group-hover:border-emerald-400'
                  : 'border-slate-200 bg-slate-100'
              }`}>
                {isChecked && <CheckIcon className="w-3 h-3 text-white" />}
              </div>
            </div>
            <span className={`text-sm font-medium leading-snug ${
              hasScrolledToBottom ? 'text-slate-700' : 'text-slate-400'
            }`}>
              我已仔細閱讀並了解以上聲明，同意本系統<strong className="text-slate-900">僅作為輔助工具</strong>使用，
              不作為醫療診斷依據，有疑慮時將尋求專業醫療協助。
            </span>
          </label>

          <button
            onClick={onAccept}
            disabled={!isChecked}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              isChecked
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckIcon className="w-5 h-5" />
            {isChecked ? '同意並開始使用' : '請先閱讀完整內容並勾選同意'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;