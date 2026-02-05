import React, { useMemo, useRef, useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { calculateAge } from '../utils/ageCalculator';
import { screeningData } from '../constants/screeningData';
import { getDomainMaxScore } from '../utils/screeningEngine';
import { CheckIcon, AlertCircleIcon, RefreshIcon, HeartIcon, DownloadIcon, StethoscopeIcon } from './Icons';
import type { DomainKey, AgeGroupKey } from '../types';
import html2canvas from 'html2canvas';

// 定義面向的預設順序
const DOMAIN_KEYS: DomainKey[] = ['gross_motor', 'fine_motor', 'cognitive_language', 'social'];

const ResultsScreen: React.FC = () => {
  const { assessmentResult, childProfile, feedback, setScreen, resetAssessment, answers } = useAssessment();
  const reportRef = useRef<HTMLDivElement>(null); 
  const [isExporting, setIsExporting] = useState(false);

  // 安全防護
  if (!assessmentResult || !childProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <p className="text-slate-500 mb-4">資料讀取中...</p>
        <button 
          onClick={() => setScreen('welcome')}
          className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          返回首頁
        </button>
      </div>
    );
  }

  const { overallStatus, domainStatuses, domainScores } = assessmentResult;

  // 1. 取得該年齡層的滿分數據與顯示名稱
  const ageData = useMemo(() => {
    const { ageGroupKey, exactAge, ageGroupDisplay } = calculateAge(
      childProfile.birthDate, 
      new Date(), 
      childProfile.gestationalAge
    );
    return {
      key: ageGroupKey,
      displayAge: exactAge,
      displayTitle: ageGroupDisplay
    };
  }, [childProfile]);

  // 2. 統一處理所有面向邏輯
  const resolvedDomains = useMemo(() => {
    if (!ageData.key) return [];
    
    const currentAgeKey = ageData.key as AgeGroupKey;

    return DOMAIN_KEYS.map(key => {
      const domainData = screeningData[currentAgeKey]?.[key];
      if (!domainData) return null;

      const maxScore = getDomainMaxScore(currentAgeKey, key);
      if (maxScore === 0) return null;

      const questions = domainData.questions || [];
      const hasDoctorAssessment = questions.some(q => answers[q.id] === 'doctor_assessment');
      const isPass = domainStatuses[key] === 'pass' || domainStatuses[key] === 'max';

      return {
        key,
        name: domainData.name, 
        score: domainScores[key] || 0,
        maxScore,
        cutoff: domainData.cutoff,
        hasDoctorAssessment,
        isPass
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [ageData.key, answers, domainStatuses, domainScores]);

  // 3. 匯出圖片功能
  const handleExportImage = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, 
        backgroundColor: '#ffffff',
        useCORS: true
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `步步熊報告_${childProfile.nickname}.png`;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  // 4. 支持性訊息主題
  const supportTheme = useMemo(() => {
    if (overallStatus === 'referral') return { bg: 'bg-rose-50', text: 'text-rose-800', bearEmoji: '🐻‍⚕️', title: '讓我們一起留意寶寶進度', actionDesc: '篩檢並非診斷。建議盡快預約小兒科醫師，進行更精確評估。' };
    if (overallStatus === 'follow_up') return { bg: 'bg-amber-50', text: 'text-amber-800', bearEmoji: '🐻', title: '寶寶正在努力進步中', actionDesc: '建議增加親子互動。若感到不放心，尋求醫師專業意見也是很好的選擇。' };
    return { bg: 'bg-emerald-50', text: 'text-emerald-800', bearEmoji: '🥳', title: '太棒了！寶寶如期達標', actionDesc: '目前發展在安全範圍。請記得定期預防接種，讓醫師進行例行評估喔！' };
  }, [overallStatus]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-24 font-sans">
      <div className={`absolute top-0 left-0 w-full h-64 ${supportTheme.bg} rounded-b-[3rem] z-0 transition-colors duration-500`}></div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-8">
        
        {/* 結果卡片 */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <div className={`${supportTheme.bg} p-8 text-center`}>
            <div className="text-7xl mb-4 animate-bounce-slow">{supportTheme.bearEmoji}</div>
            <h1 className={`text-2xl font-black mb-3 ${supportTheme.text}`}>{supportTheme.title}</h1>
          </div>
          <div className="p-6 bg-white">
            <p className="text-sm text-slate-600 leading-relaxed text-justify">{supportTheme.actionDesc}</p>
          </div>
        </div>

        {/* 評估詳情 */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">📊 各面向評估詳情</h3>
          <div className="grid grid-cols-1 gap-3">
            {resolvedDomains.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl border bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black ${item.isPass ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.score} / {item.maxScore}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部按鈕與免責聲明 */}
        <div className="mt-10 pb-6 space-y-4">
          <button 
            onClick={handleExportImage} 
            disabled={isExporting} 
            className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 transition-all"
          >
            {isExporting ? '製作報告中...' : <><DownloadIcon className="w-5 h-5" /><span>儲存結果給醫師看</span></>}
          </button>
          
          {/* ✅ 強化免責聲明：更明顯的紅色提醒 */}
          <div className="bg-rose-50 border-2 border-rose-100 p-5 rounded-2xl shadow-sm">
            <p className="text-[11px] text-rose-600 text-center leading-relaxed font-black">
              ⚠️ 【重要醫學免責聲明】<br/>
              本篩檢工具結果僅供初步參考，不能取代小兒科醫師的臨床專業診斷。
              App 不會儲存任何個人資料。請務必諮詢專業醫療團隊以獲得正式報告。
            </p>
          </div>

          <button 
            onClick={() => {
              // ✅ 修正 ts(1345)：將 void 回傳值的函式分開執行
              if (resetAssessment) {
                resetAssessment();
              } else {
                setScreen('welcome');
              }
            }} 
            className="w-full py-4 text-slate-500 font-bold flex items-center justify-center gap-2 hover:text-slate-700 transition-colors"
          >
            <RefreshIcon className="w-4 h-4" /> 返回首頁重新測驗
          </button>
        </div>
      </div>

      {/* 隱藏的匯出報告區塊 (維持原樣) */}
      <div ref={reportRef} className="fixed top-0 left-[-9999px] w-[600px] bg-white p-8 text-slate-800">
         {/* ... 報告內容省略以節省篇幅，建議保留您原本的表格實作 ... */}
         <h1 className="text-2xl font-bold">步步熊篩檢報告 - {childProfile.nickname}</h1>
         <p>檢測日期：{new Date().toLocaleDateString()}</p>
         {/* 請保留您原本 reportRef 內的 table 邏輯 */}
      </div>
    </div>
  );
};

export default ResultsScreen;