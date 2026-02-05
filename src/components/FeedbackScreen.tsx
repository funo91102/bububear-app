import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { calculateAge } from '../utils/ageCalculator';
import { CheckIcon } from './Icons'; 
// ✅ 修正 1: 移除不再需要的本地計算依賴 (screeningData, types)
// 計分邏輯已統一收斂至 src/utils/screeningEngine.ts

const FeedbackScreen: React.FC = () => {
  const { 
    setFeedback, 
    setScreen, 
    childProfile, 
    // answers, // ✅ 修正 2: 不需要在此提取 answers，Context 內部會處理
    calculateResult // ✅ 修正 3: 直接使用 Context 提供的統一計分函式
  } = useAssessment();
  
  const [anxietyScore, setAnxietyScore] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    // 1. 儲存家長回饋
    setFeedback({
      anxietyScore,
      notes
    });

    // 2. 執行計分
    if (childProfile) {
      const { ageGroupKey } = calculateAge(
        childProfile.birthDate, 
        new Date(), 
        childProfile.gestationalAge
      );

      // ✅ 修正 4: 呼叫中央計分引擎
      // 這會自動觸發 calculateAssessmentResult 並更新 Context 中的 assessmentResult 狀態
      if (ageGroupKey) {
        calculateResult(ageGroupKey);
        setScreen('results'); 
      } else {
        console.error("錯誤：無效的年齡層 Key");
        alert("資料異常：無法判定年齡層，請檢查生日設定");
        // 若發生異常，導回首頁較為安全
        setScreen('welcome');
      }
    } else {
      setScreen('welcome');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative z-10">
        
        <div className="bg-sky-50/80 p-8 text-center border-b border-sky-100 backdrop-blur-sm">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-4xl border-4 border-white">
            🧸
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">最後一哩路！</h2>
          <p className="text-slate-600 font-medium text-sm">
            謝謝您耐心地陪伴 {childProfile?.nickname || '寶寶'} 完成測驗。
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 flex justify-between items-center">
              <span>過程中的焦慮程度？</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black text-white ${
                anxietyScore > 7 ? 'bg-rose-400' : anxietyScore > 4 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}>
                {anxietyScore} 分
              </span>
            </label>
            
            <div className="relative flex items-center gap-4">
              <span className="text-2xl grayscale opacity-50">😌</span>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={anxietyScore} 
                onChange={(e) => setAnxietyScore(Number(e.target.value))}
                className="w-full h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all focus:outline-none focus:ring-4 focus:ring-sky-100"
              />
              <span className="text-2xl">😰</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wide px-10">
              <span>輕鬆</span>
              <span>焦慮</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span className="text-lg">📝</span> 有什麼想紀錄的細節嗎？
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例如：寶寶今天比較累、某一題其實好像會一點..."
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-50 focus:outline-none transition-all h-32 resize-none leading-relaxed text-sm font-medium"
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <button 
            onClick={handleSubmit}
            className="w-full py-5 rounded-[2rem] bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-200 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            <span className="font-black text-xl tracking-wider">查看分析結果</span>
            <CheckIcon className="w-6 h-6 stroke-[3] group-hover:scale-110 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default FeedbackScreen;