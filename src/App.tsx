// @ts-ignore
import React, { useState, useEffect, type FC } from 'react'; // ✅ 用 ts-ignore 避開 Vercel 的 TS6133 檢查
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import AssessmentScreen from './components/AssessmentScreen';
import ResultsScreen from './components/ResultsScreen';
import ToolPreparationScreen from './components/ToolPreparationScreen';
import FeedbackScreen from './components/FeedbackScreen';
import DisclaimerModal from './components/DisclaimerModal'; // 新增：免責聲明彈窗
import { calculateAge } from './utils/ageCalculator';
import { PlayIcon, ChevronLeftIcon, AlertCircleIcon } from './components/Icons';
import type { AgeGroupKey } from './types'; 
import './index.css';

// 定義支援的年齡層量表
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
const ConfirmationScreen: FC = () => {
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
       <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-sm border border-white/50 relative z-10 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-800">確認測驗資訊</h2>
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
                   <span className="text-rose-500">⚠️ 目前沒有適合的量表</span>
                 ) : isSupported ? (
                   <span className="text-emerald-600">✅ 系統已準備好此階段題目</span>
                 ) : (
                   <span className="text-amber-600">🚧 此階段題庫建置中</span>
                 )}
               </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              onClick={() => setScreen('welcome')}
              className="flex-1 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <ChevronLeftIcon className="w-4 h-4" />返回
            </button>
            <button 
              onClick={() => setScreen('tool_prep')} 
              disabled={!isSupported}
              className="flex-[2] py-4 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <PlayIcon className="w-5 h-5 fill-current" />下一步
            </button>
          </div>
       </div>
    </div>
  );
};

// --- 內部元件 2: 歡迎畫面（新增免責聲明邏輯） ---
const WelcomeScreen: FC = () => {
  const { setScreen, setChildProfile } = useAssessment();
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isPremature, setIsPremature] = useState(false);
  const [gestationalWeeks, setGestationalWeeks] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // 新增：免責聲明狀態管理
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);

  // 新增：檢查是否已經同意過免責聲明
  useEffect(() => {
    const accepted = localStorage.getItem('bububear_disclaimer_accepted');
    if (accepted === 'true') {
      setHasAcceptedDisclaimer(true);
    }
  }, []);

  const handleStart = () => {
    const error = validateProfileData(nickname, birthDate, isPremature, gestationalWeeks);
    if (error) {
      setErrorMsg(error);
      return;
    }
    
    // 新增：如果還沒同意免責聲明，先顯示彈窗
    if (!hasAcceptedDisclaimer) {
      setShowDisclaimer(true);
      return;
    }
    
    // 原有邏輯：繼續到下一步
    proceedToConfirmation();
  };

  // 新增：同意免責聲明後的處理
  const handleAcceptDisclaimer = () => {
    localStorage.setItem('bububear_disclaimer_accepted', 'true');
    setHasAcceptedDisclaimer(true);
    setShowDisclaimer(false);
    // 繼續到下一步
    proceedToConfirmation();
  };

  // 新增：提取原有的下一步邏輯
  const proceedToConfirmation = () => {
    setErrorMsg(null);
    let finalGestationalAge = isPremature ? parseInt(gestationalWeeks) : 40;
    if (finalGestationalAge >= 37) finalGestationalAge = 40;
    
    setChildProfile({ nickname, birthDate, gestationalAge: finalGestationalAge });
    setScreen('confirmation');
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 relative">
      {/* 新增：免責聲明彈窗 */}
      {showDisclaimer && <DisclaimerModal onAccept={handleAcceptDisclaimer} />}

      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-sm border border-white/50 z-10">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-slate-600 to-slate-800 rounded-full mx-auto flex items-center justify-center shadow-lg mb-4 border-4 border-white">
            <span className="text-4xl">🐻</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            歡迎使用步步熊<br/>兒童發展篩檢
          </h1>
          <p className="text-slate-400 text-sm mt-3 font-medium">讓我們開始關心寶貝的成長，<br/>請先提供一些基本資料。</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">寶貝的暱稱</label>
            <input 
              type="text" value={nickname} onChange={(e) => { setNickname(e.target.value); setErrorMsg(null); }}
              placeholder="例如：小胖"
              className="w-full px-4 py-3 rounded-xl bg-slate-100 border-2 border-slate-200 outline-none font-bold focus:border-emerald-400 focus:bg-white transition-all"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">出生日期</label>
            <input 
              type="date" value={birthDate} onChange={(e) => { setBirthDate(e.target.value); setErrorMsg(null); }}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 border-2 border-slate-200 outline-none font-bold focus:border-emerald-400 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">寶寶是早產兒嗎？</label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer font-bold transition-all ${isPremature ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-200 text-slate-400'}`}>
                <input type="radio" checked={isPremature} onChange={() => setIsPremature(true)} className="hidden" />是
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer font-bold transition-all ${!isPremature ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-200 text-slate-400'}`}>
                <input type="radio" checked={!isPremature} onChange={() => setIsPremature(false)} className="hidden" />否
              </label>
            </div>
            {isPremature && (
               <p className="text-[10px] text-slate-400 mt-2 px-1">早產兒指妊娠週數小於37週的寶寶。</p>
            )}
          </div>

          {isPremature && (
            <input 
              type="number" value={gestationalWeeks} onChange={(e) => { setGestationalWeeks(e.target.value); setErrorMsg(null); }}
              placeholder="請輸入妊娠週數" 
              className="w-full px-4 py-3 rounded-xl bg-slate-100 border-2 border-slate-200 outline-none font-bold focus:border-emerald-400 focus:bg-white transition-all animate-in slide-in-from-top-2 duration-200"
            />
          )}
          
          {errorMsg && (
            <div className="text-rose-500 bg-rose-50 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
              <AlertCircleIcon className="w-4 h-4" />{errorMsg}
            </div>
          )}
          
          <button 
            onClick={handleStart}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <PlayIcon className="w-5 h-5 fill-current" />下一步
          </button>
        </div>
      </div>

      {/* 底部資訊區：補回衛福部說明並統一風格 */}
      <div className="mt-8 pb-10 text-center space-y-2">
        <p className="text-[12px] text-slate-400 font-medium">傅炯皓醫師 製作</p>
        <p className="text-[11px] text-slate-400">本工具依據衛福部兒童發展連續篩檢量表設計</p>
        <p className="text-[11px] text-rose-500 font-bold px-4 tracking-tight">
          測試結果僅供參考，請與您的兒科醫師進行正式評估！
        </p>
      </div>
    </div>
  );
};

// --- 主元件 ---
const Main: FC = () => {
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