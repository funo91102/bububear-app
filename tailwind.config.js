/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. 自定義動畫名稱 (對應 animate-blob, animate-bounce-slow)
      animation: {
        blob: "blob 7s infinite",
        "bounce-slow": "bounce 3s infinite",
      },
      // 2. 自定義動畫關鍵影格 (讓背景圓形會有呼吸與移動效果)
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      // 3. 擴充文字陰影 (對應 text-shadow-sm)
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [
    // 4. 註冊一個簡單的插件來支援 animation-delay
    // 這讓您可以使用 animation-delay-2000, animation-delay-4000 等類別
    function ({ addUtilities, matchUtilities, theme }) {
      matchUtilities(
        {
          "animation-delay": (value) => ({
            "animation-delay": value,
          }),
        },
        { values: theme("transitionDelay") }
      );
      
      // 支援 text-shadow 工具類
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    },
    // 如果您有安裝 tailwindcss-animate (推薦)，請保留下面這行；若無則可忽略
    // require("tailwindcss-animate"), 
  ],
}