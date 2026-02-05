import React, { useMemo, useRef, useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { calculateAge } from '../utils/ageCalculator';
import { screeningData } from '../constants/screeningData';
import { getDomainMaxScore } from '../utils/screeningEngine';
import { RefreshIcon, DownloadIcon } from './Icons';
import type { DomainKey, AgeGroupKey } from '../types';
import html2canvas from 'html2canvas';

const DOMAIN_KEYS: DomainKey[] = ['gross_motor', 'fine_motor', 'cognitive_language', 'social'];
const DOMAIN_NAMES: Record<DomainKey, string> = {
  gross_motor: '粗大動作',
  fine_motor: '精細動作',
  cognitive_language: '認知語言',
  social: '社會發展'
};

const ResultsScreen: React.FC = () => {
  // 修正：移除解構中的 answers 變數以解決 TS6133 編譯錯誤
  const { assessmentResult, childProfile, resetAssessment } = useAssessment();
  const reportRef = useRef<HTMLDivElement>(null); 
  const [isExporting, setIsExporting] = useState(false);

  if (!assessmentResult || !childProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <p className="text-slate-500 mb-4">資料讀取中...</p>
        <button onClick={() => resetAssessment()} className="px-6 py-2 bg-sky-500 text-white rounded-lg transition-colors">
          返回首頁
        </button>
      </div>
    );
  }

  const { overallStatus, domainStatuses, domainScores } = assessmentResult;

  const ageData = useMemo(() => {
    const { ageGroupKey, exactAge, ageGroupDisplay } = calculateAge(
      childProfile.birthDate, 
      new Date(), 
      childProfile.gestationalAge
    );
    return { key: ageGroupKey, displayAge: exactAge, displayTitle: ageGroupDisplay };
  }, [childProfile]);

  const resolvedDomains = useMemo(() => {
    if (!ageData.key) return [];
    const currentAgeKey = ageData.key as AgeGroupKey;
    return DOMAIN_KEYS.map(key => {
      const domainData = screeningData[currentAgeKey]?.[key];
      if (!domainData) return null;
      const maxScore = getDomainMaxScore(currentAgeKey, key);
      if (maxScore === 0) return null;
      const isPass = domainStatuses[key] === 'pass' || domainStatuses[key] === 'max';
      return { key, name: domainData.name, score: domainScores[key] || 0, maxScore, isPass };
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [ageData.key, domainStatuses, domainScores]);

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
    } catch (err) {
      console.error('Export failed:', err);
    } finally { 
      setIsExporting(false); 
    }
  };

  const supportTheme = useMemo(() => {
    if (overallStatus === 'referral') return { bg: 'bg-rose-50', text: 'text-rose-800', bearEmoji: '🐻‍⚕️', title: '讓我們一起留意寶寶進度' };
    if (overallStatus === 'follow_up') return { bg: 'bg-amber-50', text: 'text-amber-800', bearEmoji: '🐻', title: '寶寶正在努力進步中' };
    return { bg: 'bg-emerald-50', text: 'text-emerald-800', bearEmoji: '🥳', title: '太棒了！寶寶如期達標' };
  }, [overallStatus]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-24 font-sans">
      <div className={`absolute top-0 left-0 w-full h-64 ${supportTheme.bg} rounded-b-[3rem] z-0 transition-colors`}></div>
      <div className="relative z-10 max-w-md mx-auto px-6 pt-8">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <div className={`${supportTheme.bg} p-8 text-center`}>
            <div className="text-7xl mb-4 animate-bounce-slow">{supportTheme.bearEmoji}</div>
            <h1 className={`text-2xl font-black ${supportTheme.text}`}>{supportTheme.title}</h1>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">📊 各面向評估詳情</h3>
          <div className="grid grid-cols-1 gap-3">
            {resolvedDomains.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl border bg-white shadow-sm">
                <span className="font-bold text-slate-700">{item.name}</span>
                <div className={`font-black ${item.isPass ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.score} / {item.maxScore}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pb-6 space-y-4">
          <button 
            onClick={handleExportImage} 
            disabled={isExporting} 
            className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {isExporting ? '製作報告中...' : <><DownloadIcon className="w-5 h-5" /><span>儲存結果給醫師看</span></>}
          </button>
          
          {/* ✅ 免責聲明：與首頁 App.tsx 完全對齊 */}
          <div className="text-center space-y-2 py-4">
            <p className="text-slate-400 text-[12px] font-bold">傅炯皓醫師 製作</p>
            <p className="text-slate-400 text-[11px]">本工具依據衛福部兒童發展連續篩檢量表設計</p>
            <p className="text-rose-500 text-[11px] font-bold leading-relaxed px-4">
              測試結果僅供參考，請與您的兒科醫師進行正式評估！<br/>
              App 不會儲存任何個人資料，請安心使用。
            </p>
          </div>

          <button 
            onClick={() => resetAssessment()} 
            className="w-full py-2 text-slate-400 font-bold flex items-center justify-center gap-2 text-sm hover:text-slate-600 transition-colors"
          >
            <RefreshIcon className="w-4 h-4" /> 返回首頁重新測驗
          </button>
        </div>
      </div>

      {/* 隱藏的匯出報告區塊 */}
      <div ref={reportRef} className="fixed top-0 left-[-9999px] w-[600px] bg-white p-10">
         <h1 className="text-2xl font-bold border-b-2 border-slate-100 pb-4 mb-4 text-slate-800">步步熊｜兒童發展初篩報告</h1>
         <div className="mb-6 space-y-1 text-sm text-slate-600">
           <p>受測兒童：<span className="font-bold text-slate-800">{childProfile.nickname}</span></p>
           <p>檢測日期：{new Date().toLocaleDateString()}</p>
           <p>適用量表：{ageData.displayTitle}</p>
           <p>計算年齡：{ageData.displayAge}</p>
         </div>
         <table className="w-full mb-8 border-collapse">
           <thead className="bg-slate-50 text-slate-500">
             <tr>
               <th className="py-2 text-left px-3 border-b">評估面向</th>
               <th className="py-2 text-right px-3 border-b">結果分數</th>
             </tr>
           </thead>
           <tbody>
             {resolvedDomains.map(d => (
               <tr key={d.key} className="border-b border-slate-50">
                 <td className="py-3 px-3 font-medium text-slate-700">{DOMAIN_NAMES[d.key]}</td>
                 <td className={`py-3 px-3 text-right font-bold ${d.isPass ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {d.score} / {d.maxScore}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
         <div className="mt-10 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center space-y-1">
           <p>傅炯皓醫師 製作｜本工具依據衛福部兒童發展連續篩檢量表設計</p>
           <p>測試結果僅供參考，請與您的兒科醫師進行正式評估。</p>
         </div>
      </div>
    </div>
  );
};

export default ResultsScreen;