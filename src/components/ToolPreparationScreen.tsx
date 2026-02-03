import React, { useMemo } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { calculateAge } from '../utils/ageCalculator';
import { CheckIcon, PlayIcon } from './Icons';
import type { AgeGroupKey } from '../types'; 

// --- 定義道具清單 (依據標準規格更新) ---

// 1. 嬰幼兒組 (6個月 - 1歲半)
// 包含：6-9m, 9-12m, 12-15m, 15-18m
const babyTools = [
  { title: '搖鈴', desc: '1個，測試聽力反應。' },
  { title: '玩具碗或馬克杯', desc: '1個，直徑約 8-12 公分。' },
  { title: '積木', desc: '約 2-3 公分，準備 2-4 塊即可。' },
  { title: '球', desc: '1顆，網球大小，塑膠球或紙揉成球 (直徑約 6-7 公分)。' },
  // 雖然規格表是通用的，但嬰兒期通常還不需要剪刀/蠟筆/錢幣
];

// 2. 幼兒組 (1歲半 - 4歲以上)
// 包含：1y6m~4y
const toddlerTools = [
  { title: '積木', desc: '建議準備 8 塊，約 2-3 公分，測試堆疊。' },
  { title: '有蓋小瓶子', desc: '1個，瓶口約 3.5 公分，測試轉開瓶蓋。' },
  { title: '球', desc: '1顆，網球大小，塑膠球或紙揉成球 (直徑約 6-7 公分)。' },
  { title: '蠟筆與紙', desc: '1支蠟筆與圖畫紙，測試塗鴉與畫線條。' },
  { title: '10元玩具錢幣', desc: '3個，測試精細動作與認知。' },
  { title: '安全剪刀', desc: '1把，測試手部精細動作 (較大年齡)。' },
  // 視情況可加入圖形板(選備)，但為求精簡先不列入，除非APP題目有強制要求
];

const ToolPreparationScreen: React.FC = () => {
  const { childProfile, setScreen } = useAssessment();

  // 使用 useMemo 計算需要的道具，避免重複渲染
  const requiredTools = useMemo(() => {
    if (!childProfile) return toddlerTools; // 預設值

    const { ageGroupKey } = calculateAge(
      childProfile.birthDate, 
      new Date(), 
      childProfile.gestationalAge
    );

    // 定義屬於「嬰兒組」的 Key
    const babyGroupKeys: AgeGroupKey[] = ['6-9m', '9-12m', '12-15m', '15-18m'];

    // 加上型別斷言，避免 includes 報錯
    if (ageGroupKey && babyGroupKeys.includes(ageGroupKey as AgeGroupKey)) {
      return babyTools;
    }

    return toddlerTools;
  }, [childProfile]);

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 熊熊裝飾 */}
      <div className="w-24 h-24 bg-gradient-to-tr from-stone-600 to-stone-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white mb-6 z-10 animate-bounce-slow">
        <span className="text-5xl">🐻</span>
      </div>

      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/50 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 text-shadow-sm">準備一下小道具！</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            為了符合標準化施測規格，<br/>請您協助準備以下物品：
          </p>
        </div>

        {/* 道具清單 */}
        <div className="space-y-3 mb-8">
          {requiredTools.map((tool, index) => (
            <div key={index} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-sky-50 hover:border-sky-100 transition-all group">
              <div className="mt-1 p-1 rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors shadow-sm">
                <CheckIcon className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-700 text-sm">{tool.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 按鈕 - 點擊後直接進入測驗 */}
        <button 
          onClick={() => setScreen('assessment')}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>我準備好了</span>
          <PlayIcon className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
};

export default ToolPreparationScreen;