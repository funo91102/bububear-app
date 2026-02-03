import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { CheckIcon } from './Icons'; 
import { screeningData } from '../constants/screeningData'; 
import { calculateAge } from '../utils/ageCalculator'; 
// 修正 1: 移除未使用的 DomainKey
import type { Answers, AssessmentResult } from '../types';

// --- 純函數：計算分數邏輯 ---
const calculateResults = (
  answers: Answers, 
  ageGroupKey: string
): AssessmentResult | null => {
  // 1. 取得該年齡層的題庫
  // 使用 as keyof 確保 TS 知道這是有效的索引
  const currentData = screeningData[ageGroupKey as keyof typeof screeningData];
  
  if (!currentData) return null;

  const result: AssessmentResult = {
    domainScores: {
      gross_motor: 0,
      fine_motor: 0,
      cognitive_language: 0,
      social: 0
    },
    domainStatuses: {
      gross_motor: 'fail',
      fine_motor: 'fail',
      cognitive_language: 'fail',
      social: 'fail'
    },
    overallStatus: 'normal'
  };

  let failCount = 0;

  // 2. 遍歷四個領域進行計分
  (['gross_motor', 'fine_motor', 'cognitive_language', 'social'] as const).forEach((domain) => {
    const domainData = currentData[domain];
    const questions = domainData.questions;
    
    let score = 0;
    questions.forEach(q => {
      // ⚠️ 關鍵邏輯：
      // 只有 'pass' 才得分。
      // 'fail', 'refused', 'unanswered', 'doctor_assessment' 均為 0 分
      if (answers[q.id] === 'pass') {
        score += q.weight;
      }
    });

    result.domainScores[domain] = score;

    // 3. 判斷該領域是否達標
    if (score === domainData.maxScore) {
      result.domainStatuses[domain] = 'max';
    } else if (score >= domainData.cutoff) {
      result.domainStatuses[domain] = 'pass';
    } else {
      result.domainStatuses[domain] = 'fail';
      failCount++;
    }
  });

  // 4. 判斷總體結果
  if (failCount >= 2) {
    result.overallStatus = 'referral';  // 需轉介 (2個以上領域未達標)
  } else if (failCount === 1) {
    result.overallStatus = 'follow_up'; // 需追蹤 (1個領域未達標)
  } else {
    result.overallStatus = 'normal';    // 發展正常
  }

  return result;
};

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

  const handleSubmit = () => {
    // 1. 儲存家長回饋
    setFeedback({
      anxietyScore,
      notes
    });

    // 2. 執行計分 (含防呆檢查)
    if (childProfile) {
      const { ageGroupKey } = calculateAge(
        childProfile.birthDate, 
        new Date(), 
        childProfile.gestationalAge
      );

      // 修正 2: 嚴格檢查 ageGroupKey 是否存在
      if (ageGroupKey) {
        const results = calculateResults(answers, ageGroupKey);

        if (results) {
          setAssessmentResult(results); 
          // 修正 3: 只有計算成功才跳轉，避免空白結果頁
          setScreen('results'); 
        } else {
          console.error("計算失敗：無法取得該年齡層資料");
          // 可以在這裡加入一個簡單的 alert 或錯誤提示
          alert("系統錯誤：無法計算結果，請重新操作");
        }
      } else {
        console.error("錯誤：無效的年齡層 Key");
        alert("資料異常：無法判定年齡層");
      }
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