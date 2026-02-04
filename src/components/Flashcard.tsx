import React from 'react';
import type { FlashcardOption } from '../types/index';

// ✨ 定義嚴格的 Props (Discriminated Union)
type FlashcardProps = 
  | { mode: 'single'; src: string }               // 單圖模式：必須有 src
  | { mode: 'multi'; options: FlashcardOption[] }; // 多圖模式：必須有 options

export const Flashcard: React.FC<FlashcardProps> = (props) => {
  
  // 模式 1: 四格選項圖卡 (Multi) - 18-24m, 2-3y 常用
  // 修正重點：移除 aspect-square，改用 min-h 與固定圖片大小，避免圖片塌陷
  if (props.mode === 'multi') {
    return (
      <div className="grid grid-cols-2 gap-4 w-full h-full p-2">
        {props.options.map((opt, idx) => (
          <div 
            key={idx} 
            className={`rounded-2xl flex flex-col items-center justify-center p-3 border-2 ${opt.bgColor || 'bg-white'} border-slate-100 shadow-sm min-h-[130px] transition-transform hover:scale-[1.02]`}
          >
            {/* ✅ 強制設定寬高 w-20 h-20，確保圖片一定有空間顯示 */}
            <img 
              src={opt.imageSrc} 
              alt={opt.label}
              className="w-20 h-20 object-contain mb-2 drop-shadow-sm" 
              onError={(e) => {
                console.error(`圖片載入失敗: ${opt.imageSrc}`); // 方便 Debug
                e.currentTarget.style.display = 'none'; 
                // 若圖片掛了，讓文字變大一點補位
                const span = e.currentTarget.nextSibling as HTMLElement;
                if (span) span.style.fontSize = '1.2rem';
              }}
            />
            <span className="text-sm font-black text-slate-700 text-center leading-tight">
              {opt.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // 模式 2: 單張大圖卡 (Single)
  // 修正重點：增加 drop-shadow 增加層次感
  if (props.mode === 'single') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl overflow-hidden p-2 min-h-[200px]">
        <img 
          src={props.src} 
          alt="Flashcard" 
          className="max-w-full max-h-full object-contain drop-shadow-md" 
          onError={(e) => {
             console.error(`單圖載入失敗: ${props.src}`);
             e.currentTarget.style.display = 'none'; 
          }}
        />
      </div>
    );
  }
  
  return null;
};