import React, { useState, useMemo } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { calculateAge } from '../utils/ageCalculator';
import { screeningData } from '../constants/screeningData';
// 引入防呆機制工具
import { isAgeGroupImplemented, getImplementedAgeGroups } from '../utils/screeningEngine'; 
import { CheckIcon, XMarkIcon, AlertIcon, AlertCircleIcon, StethoscopeIcon } from './Icons'; 
// 修正路徑：通常指向 types 資料夾或 types.ts 即可
import type { AnswerStatus } from '../types';
// ✅ 從外部匯入 Flashcard 元件
import { Flashcard } from './Flashcard';

const AssessmentScreen: React.FC = () => {
  const { childProfile, setAnswer, setScreen } = useAssessment();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResilience, setShowResilience] = useState(false);

  // 1. 計算年齡與 Key
  // 注意：這裡的 fallback 物件結構需與 ageCalculator.ts 回傳一致
  const ageKeyInfo = useMemo(() => {
    if (!childProfile) {
      return { 
        exactAge: '', 
        ageGroupDisplay: '', 
        ageGroupKey: null, 
        isPremature: false, 
        isCorrected: false 
      };
    }
    return calculateAge(childProfile.birthDate, new Date(), childProfile.gestationalAge);
  }, [childProfile]);
  
  const ageGroupKey = ageKeyInfo.ageGroupKey;

  // 🛡️ 防呆檢查：如果選到了未建置的年齡層，顯示「建置中」
  if (ageGroupKey && !isAgeGroupImplemented(ageGroupKey)) {
    // 動態產生可用年齡層字串
    const availableAges = getImplementedAgeGroups().join(', ');

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-amber-50 space-y-6">
        <div className="text-8xl animate-bounce">🚧</div>
        <h2 className="text-3xl font-bold text-gray-800">建置中</h2>
        <div className="bg-white/80 backdrop-blur-sm border-l-4 border-amber-400 p-6 rounded-xl text-left max-w-sm shadow-sm">
          <p className="font-bold text-amber-800 text-lg mb-2">
            目前年齡層：{ageKeyInfo.ageGroupDisplay}
          </p>
          <p className="text-amber-700 leading-relaxed">
            步步熊團隊正在努力建立此階段的題庫。
            <br />
            目前已開放測試的年齡層為：
            <br />
            <strong className="text-amber-900 bg-amber-200/50 px-1 rounded mt-1 inline-block">
              {availableAges}
            </strong>
          </p>
        </div>
        <button 
          onClick={() => setScreen('welcome')}
          className="px-8 py-3 bg-white text-amber-600 border-2 border-amber-200 rounded-full font-bold shadow-sm hover:bg-amber-100 transition-all active:scale-95"
        >
          返回首頁
        </button>
      </div>
    );
  }

  // 2. 取得資料物件 (Raw Data)
  const rawData = useMemo(() => {
    if (!ageGroupKey) return null;
    return screeningData[ageGroupKey];
  }, [ageGroupKey]);

  // 3. 展開題目列表
  const questions = useMemo(() => {
    if (!rawData) return [];
    
    return [
      ...(rawData.gross_motor?.questions || []), 
      ...(rawData.fine_motor?.questions || []), 
      ...(rawData.cognitive_language?.questions || []), 
      ...(rawData.social?.questions || [])
    ];
  }, [rawData]);

  // --- 錯誤處理介面 ---
  if (!childProfile) return <div>資料載入錯誤</div>;
  
  // 雙重保險
  if (questions.length === 0) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-slate-50">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
             <AlertCircleIcon className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">資料讀取異常</h3>
          <p className="text-slate-500 text-sm mt-2 mb-6 leading-relaxed">
            雖然年齡層已開放，但找不到題目資料。
          </p>
          <button 
            onClick={() => setScreen('welcome')} 
            className="px-8 py-3 bg-white border border-slate-300 rounded-xl text-slate-600 font-bold shadow-sm hover:bg-slate-50 transition-colors"
          >
            返回首頁
          </button>
        </div>
     );
  }

  // 取得目前題目
  const currentQuestion = questions[currentQuestionIndex];
  
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (status: AnswerStatus) => {
    if (status === 'fail') setShowResilience(true);
    else confirmAnswer(status);
  };

  const handleDoctorAssessment = () => {
    // 需確保 AnswerStatus 類型定義中有包含 'doctor_assessment'
    confirmAnswer('doctor_assessment');
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

      <div className="flex-1 overflow-y-auto p-4 pb-56">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-200/50 flex flex-col items-center">
          
          {/* ✨✨✨ 使用型別守衛 (Type Guard) 與預設值 ✨✨✨ */}
          <div className="w-full mb-6 min-h-[240px] flex items-center justify-center bg-slate-50 rounded-3xl p-1 border border-slate-100/50 relative overflow-hidden">
            
            {/* 情況 1: 多圖卡題 */}
            {currentQuestion.kind === 'multi_image' && (
              <Flashcard 
                mode="multi" 
                // 🛠 FIX: 加上 || [] 防止 undefined 錯誤
                options={currentQuestion.flashcardOptions || []} 
              />
            )}

            {/* 情況 2: 單圖卡題 */}
            {currentQuestion.kind === 'single_image' && (
              <Flashcard 
                mode="single" 
                // 🛠 FIX: 加上 || "" 防止 undefined 錯誤
                src={currentQuestion.flashcardImageSrc || ""} 
              />
            )}

            {/* 情況 3: Emoji 題 */}
            {currentQuestion.kind === 'emoji' && (
              <div className="text-8xl drop-shadow-sm select-none animate-in zoom-in duration-500">
                {currentQuestion.emoji}
              </div>
            )}
            
             {/* Fallback */}
             {!currentQuestion.kind && (
               <div className="text-8xl drop-shadow-sm select-none opacity-50">
                 🧸
               </div>
            )}
          </div>

          <div className="inline-block px-3 py-1 rounded-lg bg-sky-50 text-sky-600 text-[10px] font-black mb-4 tracking-widest uppercase border border-sky-100">
            QUESTION {currentQuestionIndex + 1}
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 leading-tight mb-4 text-center px-2">
            {currentQuestion.text}
          </h2>

          {/* 安全警示區塊 */}
          {currentQuestion.warning && (
            <div className="w-full bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl mb-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div className="flex items-start gap-3">
                <div className="text-xl">🛑</div>
                <div>
                  <h4 className="text-sm font-black text-rose-700 mb-1">安全第一</h4>
                  <p className="text-xs text-rose-800 font-medium leading-relaxed text-justify">
                    {currentQuestion.warning}
                  </p>
                </div>
              </div>
            </div>
          )}

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
      <div className={`bg-white/95 backdrop-blur-xl border-t border-slate-200 p-6 pb-12 fixed bottom-0 w-full max-w-md flex flex-col gap-4 z-40 shadow-[0_-15px_35px_-15px_rgba(0,0,0,0.1)]`}>
        
        {/* ✅ 醫師評估按鈕 (最重要的部分) */}
        {currentQuestion.allowDoctorAssessment && (
          <button
            onClick={handleDoctorAssessment}
            className="w-full py-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm hover:bg-indigo-100"
          >
            <StethoscopeIcon className="w-5 h-5" />
            <span>略過此題，標記為「醫師評估」</span>
          </button>
        )}

        {/* 作答按鈕 */}
        <div className="grid grid-cols-2 gap-5 w-full">
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
      </div>

      {/* 韌性檢核彈窗 */}
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