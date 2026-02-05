import React, { useState, useEffect } from 'react'; // ✅ 修正: 補回 React 以解決 UMD Global 錯誤
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import AssessmentScreen from './components/AssessmentScreen';
import ResultsScreen from './components/ResultsScreen';
import ToolPreparationScreen from './components/ToolPreparationScreen';
import FeedbackScreen from './components/FeedbackScreen'; 
import { calculateAge } from './utils/ageCalculator';
import { PlayIcon, ChevronLeftIcon, AlertCircleIcon } from './components/Icons';
import type { AgeGroupKey } from './types'; 
import './index.css';

// 強制型別定義，避免 Typo 且與系統型別同步
const supportedAgeGroups: AgeGroupKey[] = [
  '6-9m', '9-12m', '12-15m', '15-18m', '18-24m', 
  '2-3y', '3-4y', '4-5y', '5-7y'
];

// --- 輔助函式：驗證邏輯 ---
const validateProfileData = (
  nickname: string, 
  birthDate: string, 
  isPremature: boolean, 
  gestationalWeeks: string
): string | null => {
  if (!birthDate) return '請輸入孩子的生日，才能計算準確的年齡喔！';
  if (!nickname.trim()) return '請幫寶寶取個暱稱吧！';

  if (isPremature) {
    const weeks = parseInt(gestationalWeeks);
    if (isNaN(weeks) || weeks < 20) {
      return '請輸入有效的妊娠週數 (需大於 20 週)';
    }
  }
  return null;
};

// --- 內部元件 1: 確認資訊頁面 ---
const ConfirmationScreen = () => {
  const { childProfile, setScreen } = useAssessment();
  
  useEffect(() => {
    if (!childProfile) {
      setScreen('welcome');
    }
  }, [childProfile, setScreen]);

  if (!childProfile) return null;

  const { exactAge, ageGroupDisplay, ageGroupKey } = calculateAge(
    childProfile.birthDate, 
    new Date(), 
    childProfile.gestationalAge
  );

  const isSupported = ageGroupKey && supportedAgeGroups.includes(ageGroupKey as AgeGroupKey);

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
       <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
       <div className="absolute -bottom-8 right-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

       <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-sm border border-white/50 relative z-10 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-800">確認測驗資訊</h2>
            <p className="text-slate-500 text-sm mt-1">請確認以下資訊是否正確</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
               <div>
                 <p className="text-xs text-slate-400 font-bold mb-1">寶貝暱稱</p>
                 <p className="text-lg font-bold text-slate-700">{childProfile.nickname}</p>
               </div>
               <div className="text-right">
                 <p className="text-xs text-slate-400 font-bold mb-1">
                   {childProfile.gestationalAge < 37 ? '矯正年齡' : '目前年齡'}
                 </p>
                 <p className="text-lg font-bold text-emerald-600">{exactAge}</p>
               </div>
            </div>

            <div className={`p-5 rounded-2xl border text-center transition-colors ${
              !ageGroupKey ? 'bg-slate-50 border-slate-200' :
              isSupported ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-200'
            }`}>
               <p className="text-xs text-slate-400 font-bold mb-2">即將使用的篩檢量表</p>
               <p className={`text-2xl font-black ${isSupported ? 'text-amber-500' : 'text-slate-400'}`}>
                 {ageGroupDisplay}
               </p>
               
               <div className="mt-2 text-xs font-bold">
                 {!ageGroupKey ? (
                   <span className="text-rose-500">⚠️ 目前沒有適合的量表，建議諮詢醫師</span>
                 ) : isSupported ? (
                   <span className="text-emerald-600">✅ 系統已準備好此階段題目</span>
                 ) : (
                   <div className="text-amber-600/80 flex flex-col items-center">
                     <span>🚧 此階段題庫建置中</span>
                     <span className="font-normal opacity-80 mt-1">目前已開放：6m - 7y 完整量表</span>
                   </div>
                 )}
               </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              onClick={() => setScreen('welcome')}
              className="flex-1 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              返回
            </button>
            <button 
              onClick={() => setScreen('tool_prep')} 
              disabled={!isSupported}
              className="flex-[2] py-4 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <PlayIcon className="w-5 h-5 fill-current" />
              下一步
            </button>
          </div>
       </div>
    </div>
  );
};

// --- 內部元件 2: 歡迎畫面 ---
const WelcomeScreen = () => {
  const { setScreen, setChildProfile } = useAssessment();
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  const [isPremature, setIsPremature] = useState(false);
  const [gestationalWeeks, setGestationalWeeks] = useState('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStart = () => {
    // 1. 執行驗證
    const error = validateProfileData(nickname, birthDate, isPremature, gestationalWeeks);
    
    if (error) {
      setErrorMsg(error);
      return; 
    }

    // 2. 清除錯誤
    setErrorMsg(null);

    // 3. 計算最終週數
    let finalGestationalAge = 40; 
    if (isPremature) {
      const weeks = parseInt(gestationalWeeks);
      if (weeks >= 37) {
        finalGestationalAge = 40; 
      } else {
        finalGestationalAge = weeks;
      }
    }
    
    // 4. 設定資料並跳轉
    setChildProfile({
      nickname: nickname,
      birthDate: birthDate,
      gestationalAge: finalGestationalAge 
    });
    
    setScreen('confirmation'); 
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-sm border border-white/50 relative z-10">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-slate-600 to-slate-800 rounded-full mx-auto flex items-center justify-center shadow-lg mb-4 border-4 border-white">
            <span className="text-4xl">🐻</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight text-center">
            歡迎使用步步熊<br/>兒童發展篩檢
          </h1>
          <p className="text-slate-500 mt-2 text-sm">讓我們開始關心寶貝的成長，<br/>請先提供一些基本資料。</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1 ml-1">寶貝的暱稱</label>
            <input 
              type="text" value={nickname} onChange={(e) => { setNickname(e.target.value); setErrorMsg(null); }}
              placeholder="例如：小胖"
              className="w-full px-4 py-3 rounded-xl bg-slate-100 border-2 border-slate-200 focus:border-emerald-400 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1 ml-1">出生日期</label>
            <input 
              type="date" value={birthDate} onChange={(e) => { setBirthDate(e.target.value); setErrorMsg(null); }}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 border-2 border-slate-200 focus:border-emerald-400 focus:bg-white transition-all outline-none font-bold text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">寶寶是早產兒嗎？</label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${isPremature ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                <input type="radio" name="premature" checked={isPremature} onChange={() => setIsPremature(true)} className="w-4 h-4 accent-emerald-500" /><span className="font-bold">是</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${!isPremature ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                <input type="radio" name="premature" checked={!isPremature} onChange={() => setIsPremature(false)} className="w-4 h-4 accent-emerald-500" /><span className="font-bold">否</span>
              </label>
            </div>
            <p className="text-xs text-slate-400 mt-1 ml-1">早產兒指妊娠週數小於37週的寶寶。</p>
          </div>

          {isPremature && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-bold text-slate-600 mb-1 ml-1">出生時的妊娠週數</label>
              <input 
                type="number" value={gestationalWeeks} onChange={(e) => { setGestationalWeeks(e.target.value); setErrorMsg(null); }}
                placeholder="例如：32" min="20" 
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border-2 border-slate-200 focus:border-emerald-400 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:font-normal"
              />
            </div>
          )}

          {/* Error Message Display */}
          {errorMsg && (
            <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-4 py-3 rounded-xl text-sm font-bold animate-pulse">
              <AlertCircleIcon className="w-4 h-4" />
              {errorMsg}
            </div>
          )}

          <button 
            onClick={handleStart}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <PlayIcon className="w-5 h-5 fill-current" />
            下一步
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center space-y-1">
        <p className="text-xs text-slate-400 font-bold opacity-80">
           傅炯皓醫師 製作
        </p>
        <p className="text-xs text-slate-400 font-medium opacity-60">
           本工具依據衛福部兒童發展連續篩檢量表設計
        </p>
        <p className="text-xs text-rose-400 font-bold opacity-80 mt-1">
           測試結果僅供參考，請與您的兒科醫師進行正式評估！
        </p>
      </div>
    </div>
  );
};

const Main = () => {
  const { screen } = useAssessment();

  switch (screen) {
    case 'welcome': return <WelcomeScreen />;
    case 'confirmation': return <ConfirmationScreen />;
    case 'tool_prep': return <ToolPreparationScreen />;
    case 'assessment': return <AssessmentScreen />;
    case 'feedback': return <FeedbackScreen />; 
    case 'results': return <ResultsScreen />;
    default: return <WelcomeScreen />;
  }
};

export default function App() {
  return (
    <AssessmentProvider>
      <Main />
    </AssessmentProvider>
  );
}