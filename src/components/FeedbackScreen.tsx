import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { CheckIcon } from './Icons'; 
import { calculateAge } from '../utils/ageCalculator'; 
// ✅ 修正 1: 引入核心計分引擎
import { calculateAssessmentResult } from '../utils/screeningEngine';

const FeedbackScreen: React.FC = () => {
  const { 
    setFeedback, 
    setScreen, 
    childProfile, 
    answers, 
    setAssessmentResult 
  } = useAssessment();
  
  const [anxietyScore, setAnxietyScore] = useState(5);
  const [notes, setNotes] = useState('');
  // ✅ 建議 3: 新增處理中狀態，防止連點
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // 防止重複提交
    if (isSubmitting) return;
    
    // 1. 基礎防呆 (Guard Clause)
    if (!childProfile) {
      console.error("錯誤：找不到兒童資料");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. 儲存家長回饋
      setFeedback({
        anxietyScore,
        notes
      });

      // ✅ 建議 2: 集中時間基準點 (方便未來測試或重播)
      const now = new Date();

      const { ageGroupKey } = calculateAge(
        childProfile.birthDate, 
        now, 
        childProfile.gestationalAge
      );

      // ✅ 建議 1: 使用 Guard Clause 降低巢狀層級
      if (!ageGroupKey) {
        console.error("錯誤：無效的年齡層 Key");
        alert("無法判定適用年齡層，請檢查生日資料。");
        setIsSubmitting(false); // 發生錯誤要解鎖按鈕
        return;
      }

      // 3. 執行核心計算
      // 這裡可以視情況加入微小的 delay 讓使用者感覺到「分析中」(非必要，但有助於轉場體驗)
      await new Promise(resolve => setTimeout(resolve, 500));

      const results = calculateAssessmentResult(ageGroupKey, answers);
      
      setAssessmentResult(results); 
      setScreen('results'); 
      
    } catch (error) {
      console.error("計分引擎錯誤:", error);
      alert("系統發生錯誤，無法計算結果，請稍後再試。");
      setIsSubmitting(false); // 發生錯誤要解鎖按鈕
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
                disabled={isSubmitting} // 提交中禁止修改
                className="w-full h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSubmitting} // 提交中禁止修改
              placeholder="例如：寶寶今天比較累、某一題其實好像會一點..."
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-50 focus:outline-none transition-all h-32 resize-none leading-relaxed text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-5 rounded-[2rem] text-white shadow-xl shadow-sky-200 active:scale-95 transition-all flex items-center justify-center gap-3 group ${
              isSubmitting 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-sky-500 hover:bg-sky-600'
            }`}
          >
            {isSubmitting ? (
              <span className="font-bold text-xl tracking-wider animate-pulse">分析中...</span>
            ) : (
              <>
                <span className="font-black text-xl tracking-wider">查看分析結果</span>
                <CheckIcon className="w-6 h-6 stroke-[3] group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default FeedbackScreen;