// src/components/Flashcard.tsx
import React, { useState } from 'react';

// ▼▼▼ 【關鍵修改】使用 import type，避免執行時找不到檔案 ▼▼▼
import type { FlashcardOption } from '../types';

interface FlashcardProps {
  src?: string; // 單張大圖路徑
  options?: FlashcardOption[]; // 四格圖選項
}

const FlashcardGridOption: React.FC<{ option: FlashcardOption }> = ({ option }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`flex flex-col items-center justify-center p-2 aspect-square rounded-2xl shadow-sm border-2 border-slate-100 ${option.bgColor || 'bg-white'}`}>
      <div className="w-full h-3/4 flex items-center justify-center overflow-hidden rounded-xl bg-white">
        {hasError ? (
          <div className="text-center text-slate-400 text-xs">圖片載入失敗</div>
        ) : (
          <img 
            src={option.imageSrc} 
            alt={option.label} 
            className="object-contain h-full w-full"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      <p className="mt-2 text-lg font-bold text-slate-700">{option.label}</p>
    </div>
  );
};

export const Flashcard: React.FC<FlashcardProps> = ({ src, options }) => {
  const [hasError, setHasError] = useState(false);

  // 模式 1: 單張大圖 (3-4歲用)
  if (src) {
    return (
      <div className="w-full max-w-md mx-auto my-4 rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
        {hasError ? (
           <div className="h-64 flex items-center justify-center bg-slate-100 text-slate-500">
             無法載入圖卡：{src}
           </div>
        ) : (
          <img 
            src={src} 
            alt="Assessment Flashcard" 
            className="w-full h-auto object-contain"
            onError={(e) => {
              console.error(`Image failed to load: ${src}`, e);
              setHasError(true);
            }}
          />
        )}
      </div>
    );
  }

  // 模式 2: 四格圖 (2-3歲用)
  if (options && options.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto my-4">
        {options.map((opt) => (
          <FlashcardGridOption key={opt.label} option={opt} />
        ))}
      </div>
    );
  }

  return null;
};