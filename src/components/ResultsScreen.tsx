import React, { useMemo, useRef, useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { calculateAge } from '../utils/ageCalculator';
import { screeningData } from '../constants/screeningData';
import { getDomainMaxScore } from '../utils/screeningEngine';
import { CheckIcon, AlertCircleIcon, RefreshIcon, HeartIcon, DownloadIcon, StethoscopeIcon } from './Icons';
import ResultWarning from './ResultWarning'; // 新增：引入警示元件
import type { DomainKey, AgeGroupKey } from '../types';
import html2canvas from 'html2canvas';

// 定義面向的中文章節名稱
const DOMAIN_NAMES: Record<DomainKey, string> = {
  gross_motor: '粗大動作',
  fine_motor: '精細動作',
  cognitive_language: '認知語言',
  social: '社會發展',
};

const ResultsScreen: React.FC = () => {
  // 修正：若 feedback 未使用，建議從解構中移除以避開 TS6133，這裡保留它是因為下方的匯出報告有用到
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
      displayTitle: ageGroupDisplay,
      data: ageGroupKey ? screeningData[ageGroupKey] : null
    };
  }, [childProfile]);

  // ✨ Single Source of Truth: 統一處理所有面向的邏輯
  const resolvedDomains = useMemo(() => {
    if (!ageData.key) return [];
    
    const currentAgeKey = ageData.key as AgeGroupKey;

    return (Object.keys(DOMAIN_NAMES) as DomainKey[]).map(key => {
      const domainData = screeningData[currentAgeKey]?.[key]; // 加入 optional chaining 保護
      if (!domainData) return null;
      
      const maxScore = getDomainMaxScore(currentAgeKey, key);
      
      if (maxScore === 0) return null;

      const questions = domainData.questions || [];
      const hasDoctorAssessment = questions.some(q => answers[q.id] === 'doctor_assessment');
      
      const status = domainStatuses[key];
      // 這裡的 isPass 用於 UI 卡片的基本顏色分類 (Pass/Max 為綠色系，Fail 為紅色系)
      const isPass = status === 'pass' || status === 'max';

      return {
        key,
        name: DOMAIN_NAMES[key],
        score: domainScores[key] || 0,
        maxScore,
        cutoff: domainData.cutoff,
        hasDoctorAssessment,
        isPass,
        status // 'max' | 'pass' | 'fail'
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [ageData.key, answers, domainStatuses, domainScores]);


  // 2. 匯出圖片功能
  const handleExportImage = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, 
        backgroundColor: '#ffffff',
        useCORS: true, 
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `步步熊篩檢報告_${childProfile.nickname}_${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (error) {
      console.error('匯出失敗:', error);
      alert('抱歉，匯出圖片時發生錯誤，請稍後再試。');
    } finally {
      setIsExporting(false);
    }
  };

  // 3. 定義支持性訊息邏輯 (新增 'great' 狀態)
  const supportTheme = useMemo(() => {
    switch (overallStatus) {
      case 'referral': 
        return {
          bg: 'bg-rose-50', 
          bgStrong: 'bg-rose-100', 
          border: 'border-rose-100', 
          text: 'text-rose-800',
          icon: '💪', bearEmoji: '🐻‍⚕️',
          title: '讓我們一起多留意寶寶的進度',
          description: `每個寶寶都有自己的成長節奏。目前的篩檢結果顯示，在部分領域寶寶可能需要更多專業的評估與引導。`,
          actionTitle: '堅定建議',
          actionDesc: '篩檢並非診斷，但這是一個寶貴的提醒。建議您盡快預約小兒科醫師，進行更精確的發展評估，早期的專業協助是送給寶寶最好的成長禮物。'
        };
      case 'follow_up': // 🔧 修正：這才是「需追蹤」
        return {
          bg: 'bg-amber-50', 
          bgStrong: 'bg-amber-100',
          border: 'border-amber-100',
          text: 'text-amber-800',
          icon: '🌱', bearEmoji: '🐻',
          title: '寶寶正在努力進步中！',
          description: '目前寶寶的發展皆在及格範圍內，但部分項目尚未完全掌握，建議持續陪伴練習。',
          actionTitle: '支持指引',
          actionDesc: '建議您可以增加親子互動時間，多給予寶寶嘗試的機會。若您感到不放心，下次健兒門診時可諮詢醫師。'
        };
      case 'great': // ✅ 全滿分
        return {
          bg: 'bg-emerald-50', 
          bgStrong: 'bg-emerald-100',
          border: 'border-emerald-100',
          text: 'text-emerald-800',
          icon: '🌟', bearEmoji: '🥳',
          title: '太棒了！寶寶發展表現優異',
          description: '寶寶在所有項目皆獲得滿分，發展里程碑掌握得非常好！',
          actionTitle: '持續保持',
          actionDesc: '請繼續維持優質的親子互動與共讀習慣，並記得定期帶寶寶進行預防注射喔！'
        };
      default: // 🔧 修正：這是 'normal'（全部及格但非滿分）
        return {
          bg: 'bg-emerald-50', 
          bgStrong: 'bg-emerald-100', 
          border: 'border-emerald-100', 
          text: 'text-emerald-800',
          icon: '🌟', 
          bearEmoji: '🥳', 
          title: '太棒了！寶寶如期達標', 
          description: '目前的發展狀況良好，都在安全範圍內。', 
          actionTitle: '持續保持', 
          actionDesc: '請記得定期接種疫苗，並持續觀察寶寶的成長喔！'
        };
    }
  }, [overallStatus]);

  // 若需要顯示焦慮安撫
  const showAnxietyComfort = feedback && feedback.anxietyScore >= 7;

  const handleRestart = () => {
    if (resetAssessment) resetAssessment();
    else setScreen('welcome');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-24 font-sans">
      <div className={`absolute top-0 left-0 w-full h-64 ${supportTheme.bg} rounded-b-[3rem] z-0 transition-colors duration-500`}></div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-8">
        
        {/* 焦慮安撫 */}
        {showAnxietyComfort && (
          <div className="mb-6 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
            <HeartIcon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 fill-rose-100" />
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">給親愛的爸媽：</p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                照顧孩子不容易，您的焦慮我們都懂。請記得，篩檢只是工具，用輕鬆的心情陪伴孩子成長才是最重要的喔。
              </p>
            </div>
          </div>
        )}

        {/* 結果卡片 */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-500">
          <div className={`${supportTheme.bg} p-8 text-center relative overflow-hidden`}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
            <div className="relative inline-block mb-4">
               <div className="text-7xl drop-shadow-md animate-bounce-slow filter brightness-110">
                 {supportTheme.bearEmoji}
               </div>
               {overallStatus === 'referral' && (
                 <div className="absolute -right-2 -bottom-2 bg-white text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-slate-100 text-slate-600 whitespace-nowrap">
                   醫生陪你 💪
                 </div>
               )}
            </div>
            <h1 className={`text-2xl font-black mb-3 ${supportTheme.text} tracking-tight`}>{supportTheme.title}</h1>
            <p className="text-slate-600 text-sm font-medium leading-relaxed opacity-90">{supportTheme.description}</p>
          </div>
          <div className="p-6 bg-white">
            <div className={`rounded-xl p-5 border-l-4 ${supportTheme.bgStrong} ${supportTheme.border.replace('border-', 'border-l-')}`}>
              <h3 className={`text-sm font-black mb-2 flex items-center gap-2 ${supportTheme.text}`}>
                <span className="text-lg">{supportTheme.icon}</span>
                {supportTheme.actionTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed text-justify">{supportTheme.actionDesc}</p>
            </div>
          </div>
        </div>

        {/* 新增：警示說明區塊（在評估詳情之前） */}
        <div className="mt-8">
          <ResultWarning />
        </div>

        {/* 評估詳情 (App畫面) */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2"><span>📊</span> 各面向評估詳情</h3>
          <div className="grid grid-cols-1 gap-3">
            {resolvedDomains.map((item, index) => {
              // 樣式邏輯：Fail 為紅，Pass 為綠，Max 為金(可選)或綠
              // 這裡簡單化：Fail 為紅，其他為預設白底
              let cardStyle = item.isPass ? 'bg-white border-slate-100 shadow-sm' : 'bg-rose-50/50 border-rose-100 shadow-inner';
              if (item.hasDoctorAssessment) cardStyle = 'bg-indigo-50/50 border-indigo-100 shadow-sm';

              return (
                <div key={item.key} className={`flex flex-col p-4 rounded-2xl border transition-all hover:scale-[1.01] ${cardStyle}`} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        item.hasDoctorAssessment ? 'bg-indigo-100 text-indigo-600' :
                        item.isPass ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {item.key === 'gross_motor' && '🏃'}
                        {item.key === 'fine_motor' && '🙌'}
                        {item.key === 'cognitive_language' && '🗣️'}
                        {item.key === 'social' && '😊'}
                      </div>
                      <div>
                        <span className={`font-bold block ${item.hasDoctorAssessment ? 'text-indigo-700' : item.isPass ? 'text-slate-700' : 'text-rose-700'}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">及格標準: {item.cutoff} 分</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className={`text-sm font-black ${item.isPass ? 'text-slate-700' : 'text-rose-600'}`}>
                         {item.score} <span className="text-slate-400 text-xs font-normal">/ {item.maxScore}</span>
                       </div>
                       <div className={`flex items-center justify-end gap-1 mt-0.5 text-xs font-bold ${
                         item.hasDoctorAssessment ? 'text-indigo-600' : item.isPass ? 'text-emerald-600' : 'text-rose-500'
                       }`}>
                          {item.hasDoctorAssessment ? (<><StethoscopeIcon className="w-3 h-3" /><span>待評估</span></>) : 
                           item.isPass ? (
                             item.status === 'max' ? 
                             (<><span className="text-amber-500 text-[10px]">★</span><span>滿分</span></>) : 
                             (<><CheckIcon className="w-3 h-3" /><span>及格</span></>)
                           ) : 
                           (<><AlertCircleIcon className="w-3 h-3" /><span>需留意</span></>)}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="mt-10 pb-6 space-y-4">
          <button onClick={handleExportImage} disabled={isExporting} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70">
            {isExporting ? <span className="animate-pulse">製作報告中...</span> : <><DownloadIcon className="w-5 h-5" /><span>儲存評估結果 (給醫師看)</span></>}
          </button>
          
         {/* ✅ 底部提醒（簡短版） */}
        <div className="text-center py-2 px-4">
           <p className="text-slate-400 text-[10px] font-medium">
              本工具依據衛福部兒童發展連續篩檢量表設計
          </p>
        </div>

          <button onClick={handleRestart} className="w-full py-4 bg-white border-2 border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95">
            <RefreshIcon className="w-4 h-4" /> 返回首頁重新測驗
          </button>
        </div>
      </div>

      {/* 匯出報告隱藏區 (維持完整版以便醫師查看) */}
      <div ref={reportRef} className="fixed top-0 left-[-9999px] w-[600px] bg-white p-8 rounded-none text-slate-800" style={{ fontFamily: 'sans-serif' }}>
        <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
          <div><h1 className="text-3xl font-black text-slate-900 mb-1">步步熊｜兒童發展篩檢報告</h1><p className="text-sm text-slate-500">檢測日期：{new Date().toLocaleDateString()}</p></div>
          <div className="text-right">
             <div className="text-xl font-bold text-slate-900">{childProfile.nickname}</div>
             <div className="text-sm text-slate-600">{childProfile.gestationalAge < 37 ? '矯正年齡' : '實歲'}: {ageData.displayAge}</div>
             <div className="text-xs text-slate-400 mt-1">適用量表: {ageData.displayTitle || ageData.key}</div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 border-l-4 border-slate-800 pl-3">各面向評估數據</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100"><th className="p-3 text-left border border-slate-300 w-1/3">發展面向</th><th className="p-3 text-center border border-slate-300 w-1/4">得分 / 滿分</th><th className="p-3 text-center border border-slate-300 w-1/4">及格標準</th><th className="p-3 text-center border border-slate-300 w-1/6">狀態</th></tr>
            </thead>
            <tbody>
              {resolvedDomains.map((item) => (
                <tr key={item.key}>
                  <td className="p-3 border border-slate-300 font-bold text-slate-700">{item.name}</td>
                  <td className="p-3 border border-slate-300 text-center font-mono font-bold text-slate-800">{item.score} <span className="text-slate-400 text-xs">/ {item.maxScore}</span></td>
                  <td className="p-3 border border-slate-300 text-center text-slate-500 font-medium">≥ {item.cutoff}</td>
                  <td className={`p-3 border border-slate-300 text-center font-bold ${
                    item.hasDoctorAssessment ? 'text-indigo-600 bg-indigo-50' : 
                    !item.isPass ? 'text-rose-600 bg-rose-50' :
                    item.status === 'max' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
                  }`}>
                    {item.hasDoctorAssessment ? '醫師評估' : !item.isPass ? '需追蹤' : item.status === 'max' ? '滿分' : '通過'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {feedback && (
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl mb-6">
             <div className="flex justify-between items-center mb-3"><h2 className="text-lg font-bold border-l-4 border-slate-400 pl-3">家長主觀回饋</h2><div className="text-sm font-medium bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">焦慮指數: <b className={`ml-1 ${feedback.anxietyScore >= 7 ? 'text-rose-600' : 'text-slate-600'}`}>{feedback.anxietyScore}</b> <span className="text-slate-400 text-xs">/ 10</span></div></div>
             <div className="text-slate-700 text-sm leading-relaxed bg-white p-4 border border-slate-200 rounded-lg min-h-[60px]"><span className="text-xs text-slate-400 block mb-1 font-bold">備註紀錄：</span>{feedback.notes || "無填寫備註"}</div>
          </div>
        )}
        <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400 text-center flex justify-between items-center"><span>Powered by 步步熊 (BoBoBear)</span><span>僅供醫療諮詢參考，非正式診斷證明</span></div>
      </div>
    </div>
  );
};

export default ResultsScreen;