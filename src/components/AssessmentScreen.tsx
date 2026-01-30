import React, { useState, useMemo } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { calculateAge } from '../utils/ageCalculator';
import { screeningData } from '../constants/screeningData';
import { CheckIcon, XMarkIcon, AlertIcon, AlertCircleIcon } from './Icons'; 
import type { AnswerStatus, Question, FlashcardOption } from '../types/index';

// src/components/AssessmentScreen.tsx

// --- 內部定義 Flashcard 元件 ---
const Flashcard = ({ src, options }: { src?: string; options?: FlashcardOption[] }) => {
  // 情況 1: 顯示四格選項圖卡 (例如：踢球、喝水...)
  if (options) {
    return (
      <div className="grid grid-cols-2 gap-3 w-full h-full p-2">
        {options.map((opt, idx) => (
          <div 
            key={idx} 
            className={`rounded-2xl flex flex-col items-center justify-center p-2 border-2 ${opt.bgColor || 'bg-white'} border-slate-100 shadow-sm aspect-square overflow-hidden relative`}
          >
            {/* ▼▼▼ 修正關鍵：原本這裡是一個 span Emoji，現在改回 img ▼▼▼ */}
            <img 
              src={opt.imageSrc} 
              alt={opt.label}
              className="w-full h-3/4 object-contain mb-1" 
              onError={(e) => {
                // 為了保險起見，如果真的讀不到圖，就退回去顯示 Emoji
                e.currentTarget.style.display = 'none'; 
                e.currentTarget.parentElement?.classList.add('fallback-emoji');
              }}
            />
            {/* 如果圖片載入失敗，用 CSS 顯示這個 Emoji (需配合下方 fallback 邏輯，或單純保留圖片即可) */}
            
            <span className="text-xs font-bold text-slate-600 text-center leading-tight z-10">
              {opt.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // 情況 2: 顯示單張大圖卡
  if (src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl overflow-hidden p-2">
        <img 
          src={src} 
          alt="Flashcard" 
          className="max-w-full max-h-full object-contain" 
        />
      </div>
    );
  }
  
  return null;
};

const AssessmentScreen: React.FC = () => {
  const { childProfile, setAnswer, setScreen } = useAssessment();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResilience, setShowResilience] = useState(false);

  // 取得題目列表
  const questions = useMemo(() => {
    if (!childProfile) return [];
    
    // 使用 ageGroupKey 確保對應正確
    const { ageGroupKey } = calculateAge(
      childProfile.birthDate, 
      new Date(), 
      childProfile.gestationalAge
    );
    
    if (!ageGroupKey || !screeningData[ageGroupKey]) return [];
    
    const data = screeningData[ageGroupKey];
    return [
      ...data.gross_motor.questions, 
      ...data.fine_motor.questions, 
      ...data.cognitive_language.questions, 
      ...data.social.questions
    ];
  }, [childProfile]);

  // 無題目時的錯誤處理
  if (!childProfile) return <div>資料錯誤</div>;
  if (questions.length === 0) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-slate-50">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
             <AlertCircleIcon className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">找不到題目資料</h3>
          <p className="text-slate-500 text-sm mt-2 mb-6">
            目前的年齡層似乎沒有對應的題庫。
          </p>
          <button 
            onClick={() => setScreen('welcome')} 
            className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-bold"
          >
            返回首頁
          </button>
        </div>
     );
  }

  const currentQuestion = questions[currentQuestionIndex] as Question & { emoji?: string };
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (status: AnswerStatus) => {
    if (status === 'fail') setShowResilience(true);
    else confirmAnswer(status);
  };

  const confirmAnswer = (status: AnswerStatus) => {
    setAnswer(currentQuestion.id, status);
    setShowResilience(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setScreen('feedback'); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* 頂部進度條 */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-30">
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
          <div 
            className="h-full bg-sky-500 transition-all duration-700 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <span className="text-xs font-black text-sky-600">{Math.round(progress)}%</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-48">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-200/50 flex flex-col items-center">
          
          {/* 圖片區域 */}
          <div className="w-full mb-6 min-h-[240px] flex items-center justify-center bg-slate-50 rounded-3xl p-1 border border-slate-100/50 relative overflow-hidden">
            {currentQuestion.flashcardImageSrc || currentQuestion.flashcardOptions ? (
              <Flashcard 
                src={currentQuestion.flashcardImageSrc} 
                options={currentQuestion.flashcardOptions} 
              />
            ) : (
              <div className="text-8xl drop-shadow-sm select-none animate-in zoom-in duration-500">
                {currentQuestion.emoji || "🧸"}
              </div>
            )}
          </div>

          <div className="inline-block px-3 py-1 rounded-lg bg-sky-50 text-sky-600 text-[10px] font-black mb-4 tracking-widest uppercase border border-sky-100">
            QUESTION {currentQuestionIndex + 1}
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 leading-tight mb-4 text-center px-2">
            {currentQuestion.text}
          </h2>

          {/* 施測指引 */}
          {currentQuestion.description && (
            <div className="w-full bg-amber-50/50 border border-amber-100/50 p-4 rounded-2xl mt-2">
              <p className="text-[11px] font-bold text-amber-500 mb-1 flex items-center gap-1 uppercase tracking-tighter">
                <AlertIcon className="w-3 h-3" /> 施測指引
              </p>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                {currentQuestion.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 底部按鈕區 */}
      <div className={`bg-white/95 backdrop-blur-xl border-t border-slate-200 p-6 pb-12 fixed bottom-0 w-full max-w-md grid grid-cols-2 gap-5 z-40 shadow-[0_-15px_35px_-15px_rgba(0,0,0,0.1)]`}>
        <button 
          onClick={() => handleAnswer('fail')} 
          className={`group flex flex-col items-center justify-center py-6 rounded-[2.5rem] bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 active:scale-95 transition-all`}
        >
          <XMarkIcon className="w-9 h-9 mb-1 stroke-[3]" />
          <span className="font-black text-xl tracking-wider">還不會</span>
        </button>
        
        <button 
          onClick={() => handleAnswer('pass')} 
          className={`group flex flex-col items-center justify-center py-6 rounded-[2.5rem] bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200 active:scale-95 transition-all`}
        >
          <CheckIcon className="w-9 h-9 mb-1 stroke-[3]" />
          <span className="font-black text-xl tracking-wider">做得到</span>
        </button>
      </div>

      {/* 韌性題視窗 (彈跳視窗) */}
      {showResilience && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center z-50 p-4 pb-12 animate-in fade-in duration-200">
          <div className={`bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300`}>
            <h3 className="text-xl font-black mb-3 text-slate-800 text-center">
              再觀察一下寶寶...
            </h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed text-center px-4">
              如果孩子現在沒心情或拒絕配合，這不代表他「不會」喔！
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => confirmAnswer('refused')} 
                className={`w-full py-5 rounded-2xl bg-amber-50 text-amber-700 font-black border-2 border-amber-200 text-lg hover:bg-amber-100 transition-colors`}
              >
                😤 孩子拒絕配合
              </button>
              <button 
                onClick={() => confirmAnswer('fail')} 
                className={`w-full py-5 rounded-2xl bg-slate-50 text-slate-600 font-black border-2 border-slate-200 text-lg hover:bg-slate-100 transition-colors`}
              >
                😔 真的還不會
              </button>
            </div>
            <button 
              onClick={() => setShowResilience(false)} 
              className="mt-8 w-full py-2 text-slate-400 font-black text-sm text-center active:text-slate-600"
            >
              返回題目
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentScreen;