import React, { useMemo } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { calculateAge } from '../utils/ageCalculator';
import { CheckIcon, PlayIcon } from './Icons';
import type { AgeGroupKey } from '../types'; 

// --- 定義道具介面 ---
interface ToolItem {
  title: string;
  desc: string;
  image?: string; // 支援顯示預覽圖 (如圖卡)
  badge?: string; // 支援標籤 (如：App內建)
}

// --- 定義道具清單 (依據標準規格更新) ---

// 1. 嬰兒組 (6個月 - 1歲)
const infantTools: ToolItem[] = [
  { title: '搖鈴', desc: '1個，測試聽力與追視反應。' },
  { title: '積木或小玩具', desc: '2-4 塊，約 2-3 公分，測試抓握與敲打。' },
  { title: '玩具碗或馬克杯', desc: '1個，直徑約 8-12 公分 (9-12m 適用)。' },
  { title: '球', desc: '1顆，直徑約 6-7 公分 (9-12m 適用)。' },
];

// 2. 學步兒組 (1歲 - 1歲半)
const earlyToddlerTools: ToolItem[] = [
  { title: '蠟筆與圖畫紙', desc: '1組，測試塗鴉動作 (15-18m 必備)。' },
  { title: '湯匙', desc: '1支，測試抓握與生活自理 (15-18m 必備)。' },
  { title: '玩具碗或馬克杯', desc: '1個，測試放入物品或模仿喝水。' },
  { title: '積木', desc: '約 2-3 公分，準備 2-4 塊，測試精細抓握。' },
  { title: '貼紙或小葡萄乾', desc: '數個，測試手指精細捏取動作。' },
];

// 3. 18-24個月
const tools18to24m: ToolItem[] = [
  { 
    title: '圖卡 1 (認知/語言)', 
    desc: '包含：湯匙、小狗、汽車、皮球。', 
    image: '/assets/card1_spoon.png', 
    badge: 'App 內建'
  },
  { title: '積木', desc: '建議準備 8 塊，測試堆疊高度 (至少疊 2 塊)。' },
  { title: '有蓋小瓶子', desc: '1個，瓶口約 3.5 公分，測試轉開/鬆開瓶蓋。' },
  { title: '繪本', desc: '1本 (或健兒手冊)，測試翻頁動作。' },
  { title: '(選備) 形狀筒', desc: '含圓形、三角形、正方形，測試配對。' },
];

// 4. 2-3歲
const tools2to3y: ToolItem[] = [
  { 
    title: '圖卡 2 (動作指認)', 
    desc: '包含：洗手、踢球、喝水、拍手。',
    image: '/assets/card2_kick.png',
    badge: 'App 內建'
  },
  { title: '積木', desc: '建議準備 8 塊，測試堆疊高度 (至少疊 4 塊)。' },
  { title: '有蓋小瓶子', desc: '1個，瓶口約 3.5 公分，測試完全旋開。' },
  { title: '湯匙', desc: '1支，測試自我進食能力。' },
  { title: '蠟筆與圖畫紙', desc: '1組，測試畫線條或圓形。' },
  { title: '球', desc: '1顆，網球大小，測試丟球與跳躍。' },
];

// 5. 3-4歲 (量表七)
const tools3to4y: ToolItem[] = [
  { 
    title: '圖卡 3 (大小比較)', 
    desc: '畫面會有兩顆大小不同的球。', 
    image: '/assets/card3_combined.png',
    badge: 'App 內建'
  },
  { title: '積木', desc: '建議準備 8 塊，仿疊「品」或「田」字形。' },
  { title: '安全剪刀與紙', desc: '測試使用剪刀沿線剪紙。⚠️ 家長請全程看顧。' },
  { title: '筆與圖畫紙', desc: '測試模仿畫圓形。' },
  { title: '硬幣', desc: '3 枚 (10元硬幣大小)，測試單手掌內操作。' },
];

// 6. 4-5歲 (量表八 - 本次新增 ✅)
const tools4to5y: ToolItem[] = [
  { 
    title: '圖卡 4-8', 
    desc: '包含形狀仿畫圖卡及故事圖卡。', 
    image: '/assets/card5_story.png',
    badge: 'App 內建'
  },
  { title: '安全剪刀', desc: '測試連續剪紙。請在紙上畫一條 10cm 直線。' },
  { title: '色紙或薄紙', desc: '測試摺紙與壓痕動作。' },
  { title: '筆與圖畫紙', desc: '測試仿畫十字或方形。' },
  { title: '小球', desc: '紅、黃、藍、綠各 1 顆 (或可用圖卡替代)。' },
];

// 7. 5歲以上 (暫定)
const preschoolTools: ToolItem[] = [
  { title: '圖卡 3-9', desc: '依據年齡使用對應圖卡。', badge: 'App 內建' },
  { title: '積木', desc: '測試堆疊與模仿結構。' },
  { title: '剪刀與紙', desc: '測試使用剪刀能力。' },
  { title: '硬幣', desc: '測試掌內操作 (3枚)。' },
];

const ToolPreparationScreen: React.FC = () => {
  const { childProfile, setScreen } = useAssessment();

  // 使用 useMemo 計算需要的道具
  const requiredTools = useMemo(() => {
    // 若無資料預設顯示最小年齡層或提示
    if (!childProfile) return infantTools; 

    const { ageGroupKey } = calculateAge(
      childProfile.birthDate, 
      new Date(), 
      childProfile.gestationalAge
    );

    if (!ageGroupKey) return infantTools;

    // --- 分流邏輯 (Routing Logic) ---
    const infantKeys: AgeGroupKey[] = ['6-9m', '9-12m'];
    const earlyToddlerKeys: AgeGroupKey[] = ['12-15m', '15-18m'];
    
    // 1. 嬰兒期
    if (infantKeys.includes(ageGroupKey)) return infantTools;
    
    // 2. 學步兒前期
    if (earlyToddlerKeys.includes(ageGroupKey)) return earlyToddlerTools;

    // 3. 學步兒後期
    if (ageGroupKey === '18-24m') return tools18to24m;

    // 4. 幼兒期
    if (ageGroupKey === '2-3y') return tools2to3y;
    if (ageGroupKey === '3-4y') return tools3to4y;
    if (ageGroupKey === '4-5y') return tools4to5y; // ✅ 新增判定

    // 5. 其他 (5歲以上)
    return preschoolTools;
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
            <div key={index} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-sky-50 hover:border-sky-100 transition-all group relative overflow-hidden">
              
              {/* 左側圖示區：如果有圖片顯示縮圖，否則顯示打勾 */}
              <div className="mt-1 flex-shrink-0">
                {tool.image ? (
                  <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-1 shadow-sm group-hover:scale-110 transition-transform">
                    <img src={tool.image} alt={tool.title} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors shadow-sm">
                    <CheckIcon className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700 text-sm">{tool.title}</h3>
                    {tool.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold border border-blue-200">
                            {tool.badge}
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{tool.desc}</p>
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