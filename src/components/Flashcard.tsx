import React from 'react';
import type { FlashcardOption } from '../types/index';

// ✨ 定義嚴格的 Props (Discriminated Union)
type FlashcardProps = 
  | { mode: 'single'; src: string }               // 單圖模式：必須有 src
  | { mode: 'multi'; options: FlashcardOption[] }; // 多圖模式：必須有 options

export const Flashcard: React.FC<FlashcardProps> = (props) => {
  
  // 模式 1: 四格選項圖卡 (Multi)
  // 透過檢查 props.mode，TypeScript 知道這裡一定有 options
  if (props.mode === 'multi') {
    return (
      <div className="grid grid-cols-2 gap-3 w-full h-full p-2">
        {props.options.map((opt, idx) => (
          <div 
            key={idx} 
            className={`rounded-2xl flex flex-col items-center justify-center p-2 border-2 ${opt.bgColor || 'bg-white'} border-slate-100 shadow-sm aspect-square overflow-hidden relative`}
          >
            <img 
              src={opt.imageSrc} 
              alt={opt.label}
              className="w-full h-3/4 object-contain mb-1" 
              onError={(e) => {
                e.currentTarget.style.display = 'none'; 
                e.currentTarget.parentElement?.classList.add('fallback-emoji');
              }}
            />
            <span className="text-xs font-bold text-slate-600 text-center leading-tight z-10">
              {opt.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // 模式 2: 單張大圖卡 (Single)
  // 透過檢查 props.mode，TypeScript 知道這裡一定有 src
  if (props.mode === 'single') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl overflow-hidden p-2">
        <img 
          src={props.src} 
          alt="Flashcard" 
          className="max-w-full max-h-full object-contain" 
        />
      </div>
    );
  }
  
  return null;
};