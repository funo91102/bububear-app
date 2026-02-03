import React, { useMemo } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { calculateAge } from '../utils/ageCalculator';
import { CheckIcon, PlayIcon } from './Icons';
// ✅ 修正 1: 路徑改為正確的 '../types'
import type { AgeGroupKey } from '../types'; 

// --- 定義道具清單 ---

// 1. 嬰幼兒組 (6個月 - 1歲半)
const babyTools = [
  { title: '鮮豔的小玩具', desc: '如紅色毛線球、布偶，用於測試追視。' },
  { title: '手搖鈴', desc: '或任何會發出聲音的小玩具，測試聽力反應。' },
  { title: '杯子', desc: '不易破的塑膠杯或紙杯。' },
  { title: '小積木 (約2-3公分)', desc: '1-2個小積木、方塊或瓶蓋，測試抓握。' },
];

// 2. 幼兒組 (1歲半 - 4歲以上)
const toddlerTools = [
  { title: '積木 (約2-3公分)', desc: '建議準備 4-8 個，用於測試堆疊能力。' },
  { title: '小球', desc: '網球大小或捲起來的襪子球，測試丟球動作。' },
  { title: '有蓋小瓶子', desc: '如藥瓶或小寶特瓶，測試轉開瓶蓋能力。' },
  { title: '筆與紙', desc: '蠟筆或粗鉛筆，讓孩子塗鴉或畫線條。' },
  { title: '圖卡/繪本', desc: 'APP 會有電子圖卡，但準備實體書也可觀察翻頁。' },
];

const ToolPreparationScreen: React.FC = () => {
  const { childProfile, setScreen } = useAssessment();

  // 使用 useMemo 計算需要的道具，避免重複渲染
  const requiredTools = useMemo(() => {
    if (!childProfile) return toddlerTools; // 預設值

    // ✅ 修正 2: 變數名稱改為正確的 ageGroupKey
    const { ageGroupKey } = calculateAge(
      childProfile.birthDate, 
      new Date(), 
      childProfile.gestationalAge
    );

    // 定義屬於「嬰兒組」的 Key
    const babyGroupKeys: AgeGroupKey[] = ['6-9m', '9-12m', '12-15m', '15-18m'];

    // ✅ 修正 3: 加上型別斷言，避免 includes 報錯
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
            為了讓篩檢更順利，<br/>建議您先準備好以下物品：
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