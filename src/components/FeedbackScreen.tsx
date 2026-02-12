import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { PlayIcon } from './Icons';

// 改善建議選項（合併重複項目，移除 emoji）
const IMPROVEMENT_OPTIONS = [
  { id: 'image_small', label: '圖片/圖卡太小，看不清楚' },
  { id: 'text_unclear', label: '文字說明不夠清楚' },
  { id: 'operation_confused', label: '不知道怎麼操作' },
  { id: 'need_video', label: '需要影片示範' },
  { id: 'other', label: '其他問題' }
];

const FeedbackScreen: React.FC = () => {
  const { setScreen, setFeedback, childProfile } = useAssessment();
  
  // 🔧 Debug: 檢查 context 是否正常
  console.log('🔍 FeedbackScreen 載入，Context 狀態:', {
    hasSetScreen: !!setScreen,
    hasSetFeedback: !!setFeedback,
    hasChildProfile: !!childProfile,
    setScreenType: typeof setScreen,
    setFeedbackType: typeof setFeedback
  });
  
  const [anxietyScore, setAnxietyScore] = useState(5);
  const [notes, setNotes] = useState('');
  
  // 改善建議狀態（改為單選）
  const [selectedImprovement, setSelectedImprovement] = useState('');
  const [otherSuggestion, setOtherSuggestion] = useState('');

  // 傳送回饋到 n8n
  const sendFeedbackToN8n = async (feedbackData: any) => {
    try {
      // 檢查是否有設定 n8n webhook URL
      const webhookUrl = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_N8N_FEEDBACK_WEBHOOK;
      
      if (!webhookUrl) {
        console.log('📊 未設定 n8n webhook，跳過傳送');
        return;
      }

      // 從 childProfile 取得年齡資訊
      let ageGroup = 'unknown';
      if (childProfile?.birthDate) {
        const birthDate = new Date(childProfile.birthDate);
        const today = new Date();
        const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                       (today.getMonth() - birthDate.getMonth());
        
        // 判斷年齡層
        if (months < 9) ageGroup = '6-9m';
        else if (months < 12) ageGroup = '9-12m';
        else if (months < 15) ageGroup = '12-15m';
        else if (months < 18) ageGroup = '15-18m';
        else if (months < 24) ageGroup = '18-24m';
        else if (months < 36) ageGroup = '2-3y';
        else if (months < 48) ageGroup = '3-4y';
        else if (months < 60) ageGroup = '4-5y';
        else ageGroup = '5-7y';
      }

      // 準備傳送的數據（完全匿名）
      const payload = {
        timestamp: new Date().toISOString(),
        ageGroup: ageGroup,
        anxietyScore: feedbackData.anxietyScore,
        hasNotes: !!feedbackData.notes,
        improvement: feedbackData.improvement,
        otherSuggestion: feedbackData.otherSuggestion
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('✅ 回饋已成功傳送到 n8n');
    } catch (error) {
      // 捕捉所有錯誤，不中斷流程
      console.log('⚠️ 回饋傳送失敗（不影響使用）:', error);
    }
  };

  const handleSubmit = async () => {
    console.log('🎯 開始提交回饋...');
    
    const feedbackData = {
      anxietyScore,
      notes,
      improvement: selectedImprovement,
      otherSuggestion
    };
    
    console.log('📝 回饋資料:', feedbackData);
    
    // 設定回饋資料
    setFeedback(feedbackData);
    console.log('✅ 回饋資料已設定');

    // 傳送到 n8n（不等待，不阻擋）
    sendFeedbackToN8n(feedbackData).catch(err => {
      console.log('⚠️ 背景傳送失敗（不影響）:', err);
    });
    
    // 立即進入結果頁面
    console.log('🚀 準備進入結果頁面...');
    console.log('🔍 setScreen 函數:', setScreen);
    
    // 🔧 StackBlitz 修復：使用 setTimeout 確保狀態更新
    setTimeout(() => {
      setScreen('results');
      console.log('✅ setScreen("results") 已執行');
    }, 0);
    
    // 檢查
    setTimeout(() => {
      console.log('⏰ 1秒後檢查：頁面是否已切換？');
      console.log('📍 如果您還在回饋頁面，表示需要完全重新整理瀏覽器');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* 背景裝飾 */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-lg">
        
        {/* 標題區 */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="text-6xl mb-4 drop-shadow-lg">🎉</div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">完成測驗了！</h1>
          <p className="text-slate-500 text-sm font-medium">感謝您的用心參與</p>
        </div>

        {/* 主要卡片 */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 space-y-6 border border-white/50 animate-in zoom-in-95 duration-700 delay-300">
          
          {/* 焦慮指數 */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-3">
              😰 測驗過程中，您的焦慮程度？
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 font-bold whitespace-nowrap">完全不焦慮</span>
              <input 
                type="range" 
                min="0" 
                max="10" 
                value={anxietyScore}
                onChange={(e) => setAnxietyScore(Number(e.target.value))}
                className="flex-1 h-3 bg-gradient-to-r from-emerald-200 via-amber-200 to-rose-200 rounded-full appearance-none cursor-pointer accent-sky-500 shadow-inner"
              />
              <span className="text-xs text-slate-400 font-bold whitespace-nowrap">非常焦慮</span>
            </div>
            <div className="text-center mt-3">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-black ${
                anxietyScore <= 3 ? 'bg-emerald-100 text-emerald-700' :
                anxietyScore <= 6 ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>
                {anxietyScore} / 10
              </span>
            </div>
          </div>

          {/* 備註欄位 */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-3">
              📝 有什麼想補充的嗎？（選填）
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例如：孩子今天心情不好、某些題目不太會..."
              className="w-full p-4 border-2 border-slate-200 rounded-2xl text-sm resize-none focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all placeholder:text-slate-300"
              rows={4}
            />
          </div>

          {/* 改善建議區塊（下拉式選單） */}
          <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
            <h3 className="text-sm font-black text-sky-700 mb-2 flex items-center gap-2">
              💡 幫助我們改善
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              測驗過程中，有遇到什麼困難嗎？（選填）
            </p>
            
            {/* 下拉式選單 */}
            <select
              value={selectedImprovement}
              onChange={(e) => setSelectedImprovement(e.target.value)}
              className="w-full p-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all bg-white"
            >
              <option value="">-- 請選擇（或跳過） --</option>
              {IMPROVEMENT_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {/* 只在選擇「其他問題」時顯示文字框 */}
            {selectedImprovement === 'other' && (
              <textarea
                value={otherSuggestion}
                onChange={(e) => setOtherSuggestion(e.target.value)}
                placeholder="請描述遇到的問題..."
                className="w-full p-3 border-2 border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all placeholder:text-slate-300 mt-3"
                rows={3}
              />
            )}
          </div>

        </div>

        {/* 下一步按鈕 */}
        <button 
          onClick={handleSubmit}
          className="mt-6 w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-[2rem] font-black text-lg shadow-lg shadow-purple-200 flex items-center justify-center gap-3 active:scale-95 transition-all animate-in slide-in-from-bottom duration-700 delay-500"
        >
          <PlayIcon className="w-6 h-6" />
          查看結果
        </button>

        {/* 底部提示 */}
        <p className="text-center text-xs text-slate-400 mt-4 font-medium">
          您的回饋將幫助我們持續改善服務 🙏
        </p>
      </div>
    </div>
  );
};

export default FeedbackScreen;