import React, { useState } from 'react';
import { AlertCircleIcon, ChevronLeftIcon } from './Icons';

const ResultWarning: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6 bg-white rounded-2xl shadow-md border-2 border-rose-200 overflow-hidden">
      {/* 主要警示（始終顯示） */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircleIcon className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-rose-800 mb-1.5 flex items-center gap-2">
              ⚠️ 重要提醒
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              本結果<strong className="text-rose-700">僅供參考，不代表醫療診斷</strong>。
              每個孩子的發展速度不同，建議與您的兒科醫師進行專業評估。
            </p>
          </div>
        </div>

        {/* 展開/收合按鈕 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full py-2 px-4 bg-white/80 hover:bg-white rounded-lg text-xs font-bold text-slate-600 hover:text-slate-800 transition-all flex items-center justify-center gap-2 border border-slate-200"
        >
          <ChevronLeftIcon 
            className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-[-90deg]' : 'rotate-90'}`} 
          />
          {isExpanded ? '收起詳細說明' : '展開詳細說明'}
        </button>
      </div>

      {/* 詳細說明（可摺疊） */}
      {isExpanded && (
        <div className="p-5 bg-white border-t border-slate-200 space-y-4 animate-in slide-in-from-top-2 duration-200">
          
          {/* 如果結果顯示「建議追蹤」 */}
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
            <h4 className="text-xs font-black text-rose-700 mb-2 flex items-center gap-1.5">
              <span>🔴</span>
              如果結果顯示「需追蹤」或「需留意」
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              → 請<strong className="text-rose-700">儘快帶孩子至兒科門診</strong>進行專業評估。
              早期發現、早期介入，是給孩子最好的禮物。
            </p>
          </div>

          {/* 如果結果顯示「發展正常」 */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <h4 className="text-xs font-black text-emerald-700 mb-2 flex items-center gap-1.5">
              <span>🟢</span>
              如果結果顯示「及格」或「滿分」
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              → 恭喜！但仍建議<strong className="text-emerald-700">定期接受兒童健康檢查</strong>，
              並持續觀察孩子的成長狀況。
            </p>
          </div>

          {/* 每個孩子都不同 */}
          <div className="bg-sky-50 p-4 rounded-xl border border-sky-100">
            <h4 className="text-xs font-black text-sky-700 mb-2 flex items-center gap-1.5">
              <span>💙</span>
              每個孩子的發展速度都不同
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              發展里程碑只是參考指標，<strong className="text-sky-700">不是絕對標準</strong>。
              有任何疑慮或問題，請隨時諮詢您的兒科醫師。
            </p>
          </div>

          {/* 本工具的設計初衷 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1.5">
              <span>👨‍⚕️</span>
              本工具的設計初衷
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              這個工具是為了讓家長「預習」篩檢內容，
              <strong className="text-slate-800">減少孩子在診間的緊張感</strong>，
              並協助醫師更順利完成評估。它<strong className="text-rose-600">不能取代</strong>專業醫療判斷。
            </p>
          </div>

          {/* 底部重點提醒 */}
          <div className="pt-3 border-t border-slate-200">
            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              <strong className="text-slate-700">再次提醒：</strong>
              本系統依據衛福部兒童發展連續篩檢量表設計，
              <br />
              但測試結果僅供參考，請務必與專業醫師進行正式評估。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultWarning;