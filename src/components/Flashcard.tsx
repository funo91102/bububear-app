import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import type { FlashcardOption } from '../types/index';

// ✨ 定義嚴格的 Props (Discriminated Union)
type FlashcardProps = 
  | { mode: 'single'; src: string }               // 單圖模式：必須有 src
  | { mode: 'multi'; options: FlashcardOption[] } // 多圖模式：必須有 options
  | { mode: 'carousel'; images: string[] };       // 新增：輪播模式（圖卡 5-8）

export const Flashcard: React.FC<FlashcardProps> = (props) => {
  
  // ==================== 新增：輪播模式 ====================
  if (props.mode === 'carousel') {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalImages = props.images.length;

    // 下一張（循環）
    const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    };

    // 上一張（循環）
    const handlePrev = () => {
      setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    // 點擊圖片 = 下一張（您要求的功能）
    const handleImageClick = () => {
      handleNext();
    };

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        {/* 主圖區域（可點擊） */}
        <div className="relative w-full h-full flex items-center justify-center bg-white rounded-2xl overflow-hidden min-h-[200px] mb-3">
          <img 
            src={props.images[currentIndex]} 
            alt={`圖卡 ${currentIndex + 1}`}
            onClick={handleImageClick}
            className="max-w-full max-h-full object-contain drop-shadow-md cursor-pointer transition-transform active:scale-95" 
            onError={(e) => {
              console.error(`輪播圖片載入失敗: ${props.images[currentIndex]}`);
              e.currentTarget.style.display = 'none'; 
            }}
          />
          
          {/* 左箭頭按鈕 */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // 避免觸發圖片點擊
              handlePrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all active:scale-90 border border-slate-200"
            aria-label="上一張"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          {/* 右箭頭按鈕 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all active:scale-90 border border-slate-200"
            aria-label="下一張"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 指示器區域 */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
          {/* 圓點指示器 */}
          <div className="flex items-center gap-1.5">
            {props.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-200 ${
                  index === currentIndex 
                    ? 'w-6 h-2 bg-sky-500 rounded-full' 
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400 rounded-full'
                }`}
                aria-label={`跳到第 ${index + 1} 張`}
              />
            ))}
          </div>

          {/* 數字指示器 */}
          <div className="text-xs font-bold text-slate-600">
            {currentIndex + 1} / {totalImages}
          </div>
        </div>

        {/* 提示文字 */}
        <p className="text-[10px] text-slate-400 mt-2 font-medium">
          點擊圖片或使用左右箭頭切換
        </p>
      </div>
    );
  }
  // ==================== 輪播模式結束 ====================

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