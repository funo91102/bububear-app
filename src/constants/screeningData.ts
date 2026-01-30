// src/constants/screeningData.ts

import type { ScreeningData, AgeGroupData, Domain, DomainKey } from '../types';

// 1. 建立一個輔助函式來產生全新的 Domain 物件
// 這樣確保每個 Domain 內的 questions 陣列都是新的記憶體位址，不會互相汙染
const createEmptyDomain = (name: string, key: DomainKey): Domain => ({
  name,
  key,
  cutoff: 0,
  maxScore: 0,
  questions: [], // 這裡每次都會回傳一個新的空陣列 []
});

// 2. 建立一個輔助函式來產生全新的 AgeGroupData 物件
const createEmptyAgeGroupData = (): AgeGroupData => ({
  gross_motor: createEmptyDomain('粗大動作', 'gross_motor'),
  fine_motor: createEmptyDomain('精細動作', 'fine_motor'),
  cognitive_language: createEmptyDomain('認知語言發展', 'cognitive_language'),
  social: createEmptyDomain('社會發展', 'social'),
});

export const screeningData: ScreeningData = {
  // 3. 使用函式呼叫來賦值，確保每個年齡層的資料物件都是獨立的
  '6-9m': createEmptyAgeGroupData(), 
  '9-12m': createEmptyAgeGroupData(), 
  '12-15m': createEmptyAgeGroupData(),
  '15-18m': createEmptyAgeGroupData(), 
  '18-24m': createEmptyAgeGroupData(),
  
  // ▼ 2-3歲 完整題庫數據 (手動定義的物件本身就是獨立的)
  '2-3y': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 3, maxScore: 4, 
      questions: [
        { id: 'GM-2-3y-Q1', type: '實/問', text: '★ 可以自己稍微扶著欄杆或放手走上樓梯？', description: '不需他人牽扶，溜滑梯的小階梯即可。', weight: 2 },
        { id: 'GM-2-3y-Q2', type: '實/問', emoji: '🎾', text: '可以單手向前丟球？', description: '球直徑約6-7公分(硬式網球大小)，有加速向前丟的動作即可。', weight: 1 },
        { id: 'GM-2-3y-Q3', type: '實/問', emoji: '🐰', text: '可以雙腳離地跳？', description: '雙腳有同時離地，可稍微牽扶跳起。', weight: 1 },
      ],
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 4, maxScore: 5, 
      questions: [
        { id: 'FM-2-3y-Q1', type: '實', emoji: '🧱', text: '★ 可以疊高至少4塊積木？', description: '準備至少8塊積木(約2-3cm)，請先示範給孩子看。', weight: 2 },
        { id: 'FM-2-3y-Q2', type: '實', emoji: '🧴', text: '孩子可以獨立用手把小罐子的瓶蓋完全旋開？', description: '瓶口建議約3.5公分，旋轉螺紋約2-3圈即可。', weight: 1 },
        { id: 'FM-2-3y-Q3', type: '問', emoji: '🥄', text: '孩子可以自己用湯匙吃飯？', description: '可獨自舀起食物並放入嘴巴，食物少量灑出也可。', weight: 1 },
        { id: 'FM-2-3y-Q4', type: '實', emoji: '🖍️', text: '孩子可以拿筆連續畫圈或直線/橫線？', description: '筆跡需連續超過5公分以上，畫出圓形、Z字型、直線或橫線皆可。', weight: 1 },
      ],
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 4, maxScore: 5, 
      questions: [
        { id: 'CL-2-3y-Q1', type: '問', emoji: '🧸', text: '孩子會把不同功能的玩具搭配著一起玩？', description: '例如：用車子載積木、把娃娃放到床上、把食物放進盤子。', weight: 1 },
        { 
          id: 'CL-2-3y-Q2', type: '實', 
          text: '★ (圖卡2) 指著圖卡問『誰在洗手? 誰在踢球? 誰在喝水? 誰在拍手?』', 
          description: '可以指認或回答正確至少三題。',
          weight: 2, 
          flashcardOptions: [
            { label: '踢球', imageSrc: '/assets/card2_kick.png', bgColor: 'bg-rose-50' },
            { label: '喝水', imageSrc: '/assets/card2_drink.png', bgColor: 'bg-amber-50' },
            { label: '洗手', imageSrc: '/assets/card2_wash.png', bgColor: 'bg-sky-50' },
            { label: '拍手', imageSrc: '/assets/card2_clap.png', bgColor: 'bg-emerald-50' },
          ]
        },
        { 
          id: 'CL-2-3y-Q3', type: '實', 
          text: '★ (圖卡2) 孩子可以用片語或句子描述圖卡內容？', 
          description: '需至少使用「動詞+名詞」組合，例如：「洗手」、「踢足球」、「喝水」、「拍手」(需答對三題)。',
          weight: 2,
          flashcardOptions: [
            { label: '踢球', imageSrc: '/assets/card2_kick.png', bgColor: 'bg-rose-50' },
            { label: '喝水', imageSrc: '/assets/card2_drink.png', bgColor: 'bg-amber-50' },
            { label: '洗手', imageSrc: '/assets/card2_wash.png', bgColor: 'bg-sky-50' },
            { label: '拍手', imageSrc: '/assets/card2_clap.png', bgColor: 'bg-emerald-50' },
          ]
        },
      ],
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 4, maxScore: 5, 
      questions: [
        { id: 'S-2-3y-Q1', type: '實', emoji: '👂', text: '★ 孩子對自己的名字或小名有反應？', description: '呼喚時可以很穩定地回應。', weight: 2 },
        { id: 'S-2-3y-Q2', type: '問', emoji: '🎭', text: '★ 玩遊戲時會有假扮的玩法？', description: '例如：餵娃娃喝水或假裝餵大人吃東西。', weight: 2 },
        { id: 'S-2-3y-Q3', type: '問', emoji: '👶', text: '孩子看到其他人有情緒變化時,會有反應？', description: '當他人傷心或生氣時會停下動作關注。', weight: 1 },
      ],
    },
  },

  // ▼ 3-4歲 完整題庫數據
  '3-4y': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 4, maxScore: 5, 
      questions: [
        { id: 'GM-3-4y-Q1', type: '問', text: '可以獨自上下樓梯,不需扶欄杆或是大人牽手協助？', description: '需能放手走上樓及下樓(只會上樓不算)。', weight: 1 },
        { id: 'GM-3-4y-Q2', type: '問', emoji: '🏃', text: '可以穩穩地跑2公尺？', description: '可以小跑步至少2公尺，而非快走。', weight: 1 },
        { id: 'GM-3-4y-Q3', type: '實/問', emoji: '🎾', text: '可以單手過肩丟小球2公尺？', description: '單手舉過肩丟出至少2公尺遠(雙手或向上拋不算)。', weight: 1 },
        { id: 'GM-3-4y-Q4', type: '實', emoji: '🐰', text: '★ 可以雙腳同時離地連續跳躍至少2下？', description: '雙腳必須同時離地，且連續跳躍2下(含)以上。', weight: 2 },
      ],
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 2, maxScore: 3, 
      questions: [
        { id: 'FM-3-4y-Q1', type: '實', emoji: '⭕', text: '可以拿筆模仿畫出圓形？', description: '先示範後請孩子照畫，筆觸起點與終點需連接無缺口。', weight: 1 },
        { id: 'FM-3-4y-Q2', type: '實', emoji: '🧱', text: '可以模仿疊出『品』或『田』的形狀？', description: '使用3-4塊積木，示範後請孩子仿疊。', weight: 1 },
        { id: 'FM-3-4y-Q3', type: '實', emoji: '💰', text: '可以單手將兩枚十元硬幣一次一個收入同一手掌中？', description: '硬幣需從指尖送至掌心，且過程無掉出(可重測最多三次)。', weight: 1 },
      ],
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 3, maxScore: 4, 
      questions: [
        { id: 'CL-3-4y-Q1', type: '實', emoji: '💬', text: '可以和人一問一答持續對話,且回答內容切題？', description: '能順暢使用完整句子(主詞+動詞+受詞)回答。', weight: 1 },
        { 
          id: 'CL-3-4y-Q2', type: '實', emoji: '🖼️', 
          text: '(圖卡3) 孩子可以看圖描述內容？', 
          description: '能以3-4個詞彙的完整句子正確敘述圖卡內容。',
          weight: 1, 
          flashcardImageSrc: '/assets/card3_combined.png' 
        },
        { 
          id: 'CL-3-4y-Q3', type: '實', emoji: '🔴', 
          text: '(圖卡3) 指著圖卡問：「哪一個球比較大？」', 
          description: '能指出或說出「紅色球比較大」。',
          weight: 1, 
          flashcardImageSrc: '/assets/card3_combined.png' 
        },
        { id: 'CL-3-4y-Q4', type: '問', emoji: '👂', text: '爸媽(或主要照顧者)都聽得懂孩子的話？', description: '只要照顧者聽得懂即可，構音不需非常標準。', weight: 1 },
      ],
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 4, maxScore: 5, 
      questions: [
        { id: 'S-3-4y-Q1', type: '實', emoji: '🔢', text: '★ 可以回答出自己的名字或年齡？', description: '正確回答名字或年齡(用手指比或虛歲亦可)。', weight: 2 },
        { id: 'S-3-4y-Q2', type: '實', emoji: '👀', text: '互動過程中,孩子的眼神可以穩定看著施測者或家長？', description: '眼神穩定注視，而非短暫飄忽或只做自己的事。', weight: 1 },
        { id: 'S-3-4y-Q3', type: '問', emoji: '📝', text: '已經建立簡單的生活常規？', description: '例如：知道要出門了要穿鞋。', weight: 1 },
        { id: 'S-3-4y-Q4', type: '問', emoji: '🤝', text: '會想和(熟悉的)孩子或同學一起玩？', description: '想加入同儕遊戲(如：切菜、餵娃娃)。', weight: 1 },
      ],
    },
  },
  
  // 使用函式呼叫來賦值，確保獨立性
  '4-5y': createEmptyAgeGroupData(), 
  '5-7y': createEmptyAgeGroupData(),
};