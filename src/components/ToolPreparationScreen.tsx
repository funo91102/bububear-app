import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { calculateAge } from '../utils/ageCalculator';
import { CheckIcon } from './Icons';
import type { AgeGroupKey } from '../type/index'; // 注意這裡的路徑可能有變，若您是用 src/types.ts 請改為 '../types'

// 定義不同年齡層需要的道具清單
const getToolsForAge = (ageGroup: AgeGroupKey | null) => {
  // 預設道具 (2-5歲適用)
  const toddlerTools = [
    { title: '積木 (2-3公分)', desc: '可以準備樂高積木、乾淨的瓶蓋、或方形的小藥盒。' },
    { title: '小球 (直徑約6-7公分)', desc: '可以準備一雙捲起來的乾淨襪子，或與網球大小相近的玩具球。' },
    { title: '圖卡', desc: '別擔心，等一下 APP 會直接顯示在螢幕上喔！' },
    { title: '有蓋瓶子 (瓶口約3.5公分)', desc: '一般的寶特瓶或瓶口寬度相似的罐子都可以。' },
    { title: '安全剪刀', desc: '請準備一把適合小朋友使用的安全剪刀。' },
    { title: '筆', desc: '蠟筆、彩色筆或鉛筆都可以。' },
  ];

  // 嬰兒道具 (0-1歲適用)
  const babyTools = [
    { title: '鮮豔的小玩具', desc: '如紅色毛線球或顏色鮮豔的布偶。' },
    { title: '手搖鈴', desc: '或任何會發出聲音的小玩具。' },
    { title: '杯子', desc: '不易破的塑膠杯或紙杯。' },
    { title: '小積木 (2-3公分)', desc: '1-2個小積木或瓶蓋。' },
    { title: '圖卡', desc: 'APP 會直接顯示在螢幕上。' },
  ];

  if (!ageGroup) return toddlerTools;
  
  const babyGroups: AgeGroupKey[] = ['6-9m', '9-12m', '12-15m'];
  // @ts-ignore - 暫時忽略型別檢查以確保運作
  if (babyGroups.includes(ageGroup)) {
    return babyTools;
  }
  
  return toddlerTools;
};

const ToolPreparationScreen: React.FC = () => {
  const { childProfile, setScreen } = useAssessment();

  if (!childProfile) return null;

  const { ageGroup } = calculateAge(
    childProfile.birthDate, 
    new Date(), 
    childProfile.gestationalAge
  );

  const tools = getToolsForAge(ageGroup);

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
            這些是等一下可能會用到的小東西，<br/>大部分家裡都有喔！
          </p>
        </div>

        {/* 道具清單 */}
        <div className="space-y-4 mb-8">
          {tools.map((tool, index) => (
            <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-sky-50 transition-colors group">
              <div className="mt-1 p-1 rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                <CheckIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">{tool.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 按鈕 */}
        <button 
          onClick={() => setScreen('assessment')}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          我準備好了！
        </button>
      </div>
    </div>
  );
};

export default ToolPreparationScreen;