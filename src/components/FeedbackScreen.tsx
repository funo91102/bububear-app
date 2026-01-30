import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { CheckIcon } from './Icons'; 
import { screeningData } from '../constants/screeningData'; 
import { calculateAge } from '../utils/ageCalculator'; 
// ▼▼▼ 修正 1：引入正確的型別定義 ▼▼▼
import type { Answers } from '../types';

// ▼▼▼ 修正 2：更新參數型別 (Record<string, string> -> Answers) ▼▼▼
const calculateResults = (
  answers: Answers, 
  ageGroupKey: string
) => {
  const currentData = screeningData[ageGroupKey as keyof typeof screeningData];
  if (!currentData) return null;

  const result: any = {
    domainScores: {},
    domainStatuses: {},
    overallStatus: 'normal'
  };

  let failCount = 0;

  (['gross_motor', 'fine_motor', 'cognitive_language', 'social'] as const).forEach(domain => {
    const domainData = currentData[domain];
    const questions = domainData.questions;
    
    let score = 0;
    questions.forEach(q => {
      // 因為現在 answers 是強型別，TypeScript 知道這裡的值只會是 
      // 'pass' | 'fail' | 'refused' | 'unanswered' | undefined
      if (answers[q.id] === 'pass') {
        score += q.weight;
      }
    });

    result.domainScores[domain] = score;

    if (score === domainData.maxScore) {
      result.domainStatuses[domain] = 'max';
    } else if (score >= domainData.cutoff) {
      result.domainStatuses[domain] = 'pass';
    } else {
      result.domainStatuses[domain] = 'fail';
      failCount++;
    }
  });

  if (failCount >= 2) {
    result.overallStatus = 'referral';
  } else if (failCount === 1) {
    result.overallStatus = 'follow_up';
  } else {
    result.overallStatus = 'normal';
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
    setFeedback({
      anxietyScore,
      notes
    });

    if (childProfile) {
      const { ageGroupKey } = calculateAge(
        childProfile.birthDate, 
        new Date(), 
        childProfile.gestationalAge
      );

      // 這裡傳入的 answers 已經符合 Answers 型別，不會再報錯
      const results = calculateResults(answers, ageGroupKey);

      if (results) {
        setAssessmentResult(results); 
      }
    }
    
    setScreen('results'); 
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