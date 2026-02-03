import type { ScreeningData, AgeGroupData, Domain, DomainKey } from '../types';

// --- 輔助函式：產生空資料 (用於尚未建置的層級) ---
const createEmptyDomain = (name: string, key: DomainKey): Domain => ({
  name,
  key,
  cutoff: 0,
  maxScore: 0,
  questions: [],
});

const createEmptyAgeGroupData = (): AgeGroupData => ({
  gross_motor: createEmptyDomain('粗大動作', 'gross_motor'),
  fine_motor: createEmptyDomain('精細動作', 'fine_motor'),
  cognitive_language: createEmptyDomain('認知語言發展', 'cognitive_language'),
  social: createEmptyDomain('社會發展', 'social'),
});

// --- 正式資料庫 ---
export const screeningData: ScreeningData = {
  
  // ==========================================
  // 1. 6-9 個月 (已驗證 ✅)
  // ==========================================
  '6-9m': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 5, maxScore: 6,
      questions: [
        { id: 'GM-6-9m-Q1', type: '實', text: '趴著時能用手肘或手掌支撐將上半身抬離床面？', weight: 1, emoji: '👶', kind: 'emoji', description: '需維持頭部穩定。' },
        { id: 'GM-6-9m-Q2', type: '實', text: '★ 可以翻身？', weight: 1, emoji: '🔄', kind: 'emoji', description: '需可從躺姿翻至趴姿，兩側皆可。' },
        { id: 'GM-6-9m-Q3', type: '實', text: '在些微輔助下能維持坐姿，且身體不會過度前傾？', weight: 1, emoji: '🧘', kind: 'emoji', description: '呈現三點坐姿或獨立坐姿。' },
        { 
          id: 'GM-6-9m-Q4', type: '實', text: '牽引反射：由躺姿拉到坐姿時，頭部能與軀幹維持直線？', weight: 1, emoji: '📏', kind: 'emoji', 
          description: '頭部不會向後仰。',
          warning: '⚠️ 此動作涉及頸部安全，家長操作時請務必緩慢輕柔。若不確定如何操作，請勾選「交由醫師評估」。',
          allowDoctorAssessment: true
        },
        { 
          id: 'GM-6-9m-Q5', type: '實', text: '抬軀反射 (Landau)：腹部被托住時，頭與下肢能向上伸直？', weight: 2, emoji: '✈️', kind: 'emoji',
          description: '呈現飛翔姿勢，且下壓頭部時腿部會彎曲。',
          warning: '⚠️ 危險動作警示：此動作需將嬰兒腹部托起懸空，請務必在「軟墊」或「床鋪」上方進行。若您沒有把握或不熟悉操作，請跳過此題並點選「醫師評估」。',
          allowDoctorAssessment: true 
        },
      ]
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 4, maxScore: 5,
      questions: [
        { id: 'FM-6-9m-Q1', type: '問', text: '可以用雙手握著物品（例如奶瓶）？', weight: 1, emoji: '🍼', kind: 'emoji' },
        { id: 'FM-6-9m-Q2', type: '實', text: '手帕蓋在臉上時，會用單手拿開？', weight: 1, emoji: '🙈', kind: 'emoji', description: '左右手均需測試。' },
        { id: 'FM-6-9m-Q3', type: '實', text: '★ 大拇指可以伸直與外展，不會持續內縮握拳？', weight: 2, emoji: '👍', kind: 'emoji', description: '大拇指可離開掌心。' },
        { id: 'FM-6-9m-Q4', type: '實', text: '可以耙抓小玩具？', weight: 1, emoji: '🦀', kind: 'emoji', description: '用四指及掌心抓取。' },
      ]
    },
    cognitive_language: {
      name: '認知語言社會', key: 'cognitive_language', cutoff: 4, maxScore: 5,
      questions: [
        { id: 'CL-6-9m-Q1', type: '實', text: '○ 呼喊孩子名字或小名有反應？', weight: 1, emoji: '👂', kind: 'emoji' },
        { id: 'CL-6-9m-Q2', type: '實', text: '★ 拿玩具在面前搖晃並跨過中線移動，眼球會追視？', weight: 1, emoji: '🧶', kind: 'emoji' },
        { id: 'CL-6-9m-Q3', type: '實/問', text: '被逗弄說話時，有聲音回應？', weight: 1, emoji: '💬', kind: 'emoji' },
        { id: 'CL-6-9m-Q4', type: '實/問', text: '逗孩子時，他會笑得很開心？', weight: 1, emoji: '😆', kind: 'emoji' },
        { id: 'CL-6-9m-Q5', type: '問', text: '遇到不喜歡的食物會有抗拒行為？', weight: 1, emoji: '🙅', kind: 'emoji' },
      ]
    },
    social: createEmptyDomain('社會發展', 'social'), 
  },

  // ==========================================
  // 2. 9-12 個月 (已驗證 ✅)
  // ==========================================
  '9-12m': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 4, maxScore: 5,
      questions: [
        { id: 'GM-9-12m-Q1', type: '實', text: '★ 能自己放手坐穩至少1分鐘，不會搖晃或跌倒？', weight: 1, emoji: '🧘', kind: 'emoji', description: '能背部挺直且獨立坐穩至少1分鐘，不需以手臂或外力支撐。' },
        { id: 'GM-9-12m-Q2', type: '實/問', text: '可以往前移動爬行一小段距離(至少30cm)？', weight: 1, emoji: '🐢', kind: 'emoji', description: '可以胸部貼地匍匐前進或胸部離地爬行。' },
        { id: 'GM-9-12m-Q3', type: '實/問', text: '可以由躺或趴的姿勢自己坐起來？', weight: 1, emoji: '🛌', kind: 'emoji' },
        { id: 'GM-9-12m-Q4', type: '實', text: '將雙手放在孩子腋下，稍加支撐孩子就能站得很挺？', weight: 1, emoji: '🧍', kind: 'emoji', description: '稍加支撐即可雙腳伸直，呈現站立姿勢。' },
        { 
          id: 'GM-9-12m-Q5', type: '實', text: '是否出現『降落傘反射』(Parachute Reflex)？', weight: 1, emoji: '🪂', kind: 'emoji',
          description: '抱起孩子身體突然向下衝，孩子會伸出雙手做出支撐保護動作。',
          warning: '⚠️ 此動作需快速且注意安全，若家長不確定如何測試，請勾選「交由醫師評估」。',
          allowDoctorAssessment: true
        },
      ]
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 3, maxScore: 4,
      questions: [
        { id: 'FM-9-12m-Q1', type: '實/問', text: '★ 會將玩具由一手換至另一手？', weight: 1, emoji: '🤲', kind: 'emoji', description: '可在身體中線處將物品從一手換到另一手中，過程物品不會掉落。' },
        { id: 'FM-9-12m-Q2', type: '實/問', text: '會用食指去戳或按東西？', weight: 1, emoji: '👆', kind: 'emoji', description: '有單獨的手指分離動作(如戳洞、按按鍵)。' },
        { id: 'FM-9-12m-Q3', type: '實/問', text: '可以單手持續搖動玩具至少3下？', weight: 1, emoji: '🔔', kind: 'emoji' },
        { id: 'FM-9-12m-Q4', type: '實', text: '能以拇指與食指(中指)對握方式抓握積木？', weight: 1, emoji: '👌', kind: 'emoji', description: '使用指尖或遠端指腹對握(可見清楚虎口)，而非手掌抓。' },
      ]
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 3, maxScore: 4,
      questions: [
        { id: 'CL-9-12m-Q1', type: '實/問', text: '會一手各拿一個玩具相互敲打？', weight: 1, emoji: '🥁', kind: 'emoji' },
        { id: 'CL-9-12m-Q2', type: '實/問', text: '玩具在孩子面前掉在視線外，孩子眼神會去找？', weight: 1, emoji: '👀', kind: 'emoji' },
        { id: 'CL-9-12m-Q3', type: '實/問', text: '出現多種語音組合(牙牙學語)，如 ba-ba, ma-ma？', weight: 1, emoji: '🗣️', kind: 'emoji', description: '可以使用語音組合與聲調進行類溝通。' },
        { id: 'CL-9-12m-Q4', type: '實/問', text: '會舉雙手示意要抱抱？', weight: 1, emoji: '🙌', kind: 'emoji' },
      ]
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 4, maxScore: 5,
      questions: [
        { id: 'S-9-12m-Q1', type: '實/問', text: '★ 呼喊孩子名字或小名有反應？', weight: 1, emoji: '👂', kind: 'emoji', description: '有視線或聲音反應。' },
        { id: 'S-9-12m-Q2', type: '實/問', text: '會嘗試模仿大人的簡單動作或表情？', weight: 1, emoji: '👋', kind: 'emoji', description: '如嘟嘴、拍手、拜拜等。' },
        { id: 'S-9-12m-Q3', type: '實/問', text: '可以跟大人玩 peek-a-boo (躲貓貓) 的遊戲？', weight: 1, emoji: '🙈', kind: 'emoji', description: '有出現遊戲互動意圖(笑或表情回應)。' },
        { id: 'S-9-12m-Q4', type: '實', text: '看到醫生或陌生人會有怕生或害羞的反應？', weight: 1, emoji: '😳', kind: 'emoji' },
        { id: 'S-9-12m-Q5', type: '實', text: '互動時，孩子和大人有目光接觸嗎？', weight: 1, emoji: '👁️', kind: 'emoji' },
      ]
    }
  },

  // ==========================================
  // 3. 12-15 個月 (已驗證 ✅)
  // ==========================================
  '12-15m': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 3, maxScore: 4,
      questions: [
        { id: 'GM-12-15m-Q1', type: '實/問', text: '★ 能自己扶著傢俱走或牽手走嗎？', weight: 2, emoji: '🪜', kind: 'emoji', description: '能自己扶著傢俱側走或大人不需給予太多力量協助即可向前走。' },
        { id: 'GM-12-15m-Q2', type: '實/問', text: '可以(扶著傢俱)蹲下或彎腰撿起地上物品然後恢復站姿嗎？', weight: 1, emoji: '⬇️', kind: 'emoji', description: '可穩定扶物或不扶物蹲下或彎腰取物再恢復站姿。' },
        { id: 'GM-12-15m-Q3', type: '問', text: '可以爬上沙發或矮凳或樓梯嗎？', weight: 1, emoji: '🛋️', kind: 'emoji', description: '可以獨自爬上沙發或矮凳或樓梯。', warning: '家長請在旁注意防跌安全。' },
      ],
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 3, maxScore: 4,
      questions: [
        { id: 'FM-12-15m-Q1', type: '實/問', text: '★ 可以用拇指及食指對握拿取貼紙或如葡萄乾大小的小東西？', weight: 2, emoji: '👌', kind: 'emoji', description: '可以用拇指及食指指尖或指腹對握拿取 (Pincer grasp)。' },
        { id: 'FM-12-15m-Q2', type: '實/問', text: '可以把物品放在大人手中？', weight: 1, emoji: '🤲', kind: 'emoji', description: '可以「有意識地」把物品放在大人手中(輕放)。' },
        { id: 'FM-12-15m-Q3', type: '實/問', text: '能把物品放入寬口容器裡？', weight: 1, emoji: '🥣', kind: 'emoji', description: '例如將積木放進玩具碗或馬克杯中。' },
      ],
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 4, maxScore: 6,
      questions: [
        { id: 'CL-12-15m-Q1', type: '實', text: '指著桌上貼紙說『你看，有...』，孩子可以立即看向該物品？', weight: 1, emoji: '👀', kind: 'emoji', description: '孩子眼神可以明確地看向大人指的物品 (Joint attention)。' },
        { id: 'CL-12-15m-Q2', type: '實', text: '在孩子面前將貼紙或小玩具蓋起來(或藏在手中)，孩子會嘗試去找尋？', weight: 1, emoji: '🔍', kind: 'emoji', description: '孩子會嘗試指出或拉起遮布找玩具。' },
        { id: 'CL-12-15m-Q3', type: '實/問', text: '可以在沒有手勢提示或示範下，聽懂簡單指令並做出回應？', weight: 1, emoji: '👂', kind: 'emoji', description: '例如：「拍手」、「坐下」、「過來」。' },
        { id: 'CL-12-15m-Q4', type: '實/問', text: '★ 會說1-2個有意義的「詞彙」？', weight: 2, emoji: '🗣️', kind: 'emoji', description: '會講出照顧者聽得懂的有意義詞彙至少1-2個 (如：爸爸、媽媽)。' },
        { id: 'CL-12-15m-Q5', type: '實/問', text: '會發出 ba-ba, ma-ma, da-da 之類的聲音？', weight: 1, emoji: '🎵', kind: 'emoji', description: '使用多種語音組合進行類溝通意圖。' },
      ],
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 3, maxScore: 5, 
      questions: [
        { id: 'S-12-15m-Q1', type: '實/問', text: '★ 呼喊孩子名字或小名有反應？', weight: 2, emoji: '🙋', kind: 'emoji', description: '有視線或聲音反應。' },
        { id: 'S-12-15m-Q2', type: '實/問', text: '可以和大人玩肢體互動遊戲？', weight: 1, emoji: '🙌', kind: 'emoji', description: '例如交替擊掌 (high five) 或炒蘿蔔等遊戲。' },
        { id: 'S-12-15m-Q3', type: '實', text: '施測過程中，孩子可以眼神穩定地看向家長或施測者進行互動？', weight: 1, emoji: '👁️', kind: 'emoji', description: '眼神接觸穩定。' },
        { id: 'S-12-15m-Q4', type: '實', text: '離開時，跟孩子說『掰掰』，孩子會回應？', weight: 1, emoji: '👋', kind: 'emoji', description: '有視覺或者掰掰手勢回應。' },
      ],
    },
  },

  // ==========================================
  // 4. 15-18 個月 (✨ New: 本次新增)
  // ==========================================
  '15-18m': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 3, maxScore: 4,
      questions: [
        { id: 'GM-15-18m-Q1', type: '實', text: '能放手走至少 2-3 步？', weight: 1, emoji: '🚶', kind: 'emoji', description: '大人不需給予力量協助。' },
        { id: 'GM-15-18m-Q2', type: '實/問', text: '★ 能放手站至少 30 秒？', weight: 2, emoji: '🧍', kind: 'emoji', description: '在不扶東西的情況下，能維持站立姿勢至少 30 秒。' },
        { 
          id: 'GM-15-18m-Q3', type: '實', text: '放手走或扶走時步態是否正常？', weight: 1, emoji: '👣', kind: 'emoji', 
          description: '觀察重點：沒有持續踮腳尖 (tip-toe)、沒有剪刀式步態 (雙腳交叉)、左右步態對稱。',
          allowDoctorAssessment: true 
        },
      ],
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 3, maxScore: 4,
      questions: [
        { id: 'FM-15-18m-Q1', type: '實', text: '★ 能以「拇指與食指(中指)對握」方式抓握積木？', weight: 2, emoji: '👌', kind: 'emoji', description: '使用指尖或指腹對握 (Pincer grasp)，而非僅用手掌抓。' },
        { id: 'FM-15-18m-Q2', type: '實', text: '可以拿筆在紙上隨意塗鴉？', weight: 1, emoji: '🖍️', kind: 'emoji', description: '能握筆在紙上畫出連續超過 2.5cm 的筆跡。' },
        { id: 'FM-15-18m-Q3', type: '問', text: '會嘗試使用家中常見物品？', weight: 1, emoji: '🥄', kind: 'emoji', description: '例如：嘗試拿湯匙/叉子靠近嘴巴、拿杯子喝水等動作。' },
      ],
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 3, maxScore: 5,
      questions: [
        { id: 'CL-15-18m-Q1', type: '實/問', text: '★ 可以沒有手勢提示下，聽懂簡單指令並回應？', weight: 2, emoji: '👂', kind: 'emoji', description: '例如：「拿ＯＯ」、「關門」、「打開」等，大人不可以用手比，孩子能聽懂並照做。' },
        { id: 'CL-15-18m-Q2', type: '實/問', text: '孩子會用自己的「食指」來指向想要的物品？', weight: 1, emoji: '👆', kind: 'emoji', description: '是用食指指，而非拉大人的手或用整個手掌去比。' },
        { id: 'CL-15-18m-Q3', type: '實/問', text: '會用口語或肢體動作(點頭或搖頭)表示「要」或「不要」？', weight: 1, emoji: '🙅', kind: 'emoji', description: '能明確表達需求或拒絕。' },
        { id: 'CL-15-18m-Q4', type: '實/問', text: '會說五個以上有意義的「詞彙」？', weight: 1, emoji: '🗣️', kind: 'emoji', description: '要是照顧者聽得懂的有意義詞彙，單純仿說或無意義的發音不算。' },
      ],
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 3, maxScore: 5,
      questions: [
        { id: 'S-15-18m-Q1', type: '實', text: '★ 呼喊孩子名字或小名有反應？', weight: 2, emoji: '🙋', kind: 'emoji', description: '呼喚時有視線接觸或聲音回應。' },
        { id: 'S-15-18m-Q2', type: '實/問', text: '可以模仿別人的動作？', weight: 1, emoji: '👋', kind: 'emoji', description: '例如：拍手、敲打、拜拜等簡單動作。' },
        { 
          id: 'S-15-18m-Q3', type: '實', text: '孩子有怕生、害羞或對外在環境有眼神觀察的行為表現？', weight: 1, emoji: '😳', kind: 'emoji', 
          description: '請選「是」：這代表孩子有正常的社交警覺性。\n若孩子對陌生人/環境「完全不理會、無反應」，請選「否」。',
          warning: '💡 發展提示：此階段孩子出現怕生是正常的依附關係表現，反而是「完全不怕生」或「無視他人」需要關注。',
          allowDoctorAssessment: true 
        },
        { id: 'S-15-18m-Q4', type: '實', text: '離開時跟孩子說「掰掰」，孩子會回應？', weight: 1, emoji: '🚪', kind: 'emoji', description: '有視覺注視或者揮手掰掰的回應皆可。' },
      ],
    },
  },

  // ==========================================
  // 5. 18-24 個月
  // ==========================================
  '18-24m': createEmptyAgeGroupData(),

  // ==========================================
  // 6. 2-3 歲 (已驗證 ✅)
  // ==========================================
  '2-3y': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 3, maxScore: 4,
      questions: [
        { 
          id: 'GM-2-3y-Q1', type: '實/問', weight: 2, text: '★ 可以自己稍微扶著欄杆或放手走上樓梯？', 
          description: '不需他人牽扶，溜滑梯的小階梯即可。', emoji: '🪜', kind: 'emoji' 
        },
        { id: 'GM-2-3y-Q2', type: '實/問', weight: 1, text: '可以單手向前丟球？', emoji: '🎾', kind: 'emoji' },
        { 
          id: 'GM-2-3y-Q3', type: '實/問', weight: 1, text: '可以雙腳離地跳？', emoji: '🐰', kind: 'emoji' 
        },
      ],
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 4, maxScore: 5, 
      questions: [
        { id: 'FM-2-3y-Q1', type: '實', weight: 2, text: '★ 可以疊高至少4塊積木？', emoji: '🧱', kind: 'emoji' },
        { id: 'FM-2-3y-Q2', type: '實', weight: 1, text: '孩子可以獨立旋開小罐子的瓶蓋？', emoji: '🧴', kind: 'emoji' },
        { id: 'FM-2-3y-Q3', type: '問', weight: 1, text: '孩子可以自己用湯匙吃飯？', emoji: '🥄', kind: 'emoji' },
        { id: 'FM-2-3y-Q4', type: '實', weight: 1, text: '孩子可以拿筆連續畫圈或直線？', emoji: '🖍️', kind: 'emoji' },
      ],
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 4, maxScore: 5, 
      questions: [
        { id: 'CL-2-3y-Q1', type: '問', weight: 1, text: '孩子會把不同功能的玩具搭配著一起玩？', emoji: '🧸', kind: 'emoji' },
        { 
          id: 'CL-2-3y-Q2', type: '實', weight: 2, text: '★ (圖卡2) 指認洗手、踢球、喝水、拍手？', 
          kind: 'multi_image',
          flashcardOptions: [
            { label: '踢球', imageSrc: '/assets/card2_kick.png', bgColor: 'bg-rose-50' },
            { label: '喝水', imageSrc: '/assets/card2_drink.png', bgColor: 'bg-amber-50' },
            { label: '洗手', imageSrc: '/assets/card2_wash.png', bgColor: 'bg-sky-50' },
            { label: '拍手', imageSrc: '/assets/card2_clap.png', bgColor: 'bg-emerald-50' },
          ]
        },
        { 
          id: 'CL-2-3y-Q3', type: '實', weight: 2, text: '★ (圖卡2) 用片語描述圖卡內容？', 
          kind: 'multi_image',
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
        { id: 'S-2-3y-Q1', type: '實', weight: 2, text: '★ 孩子對自己的名字有反應？', emoji: '👂', kind: 'emoji' },
        { id: 'S-2-3y-Q2', type: '問', weight: 2, text: '★ 玩遊戲時會有假扮的玩法？', emoji: '🎭', kind: 'emoji' },
        { id: 'S-2-3y-Q3', type: '問', weight: 1, text: '看到其他人有情緒變化時會有反應？', emoji: '👶', kind: 'emoji' },
      ],
    },
  },

  // ==========================================
  // 7. 3歲以上 (Placeholder)
  // ==========================================
  '3-4y': createEmptyAgeGroupData(), 
  '4-5y': createEmptyAgeGroupData(), 
  '5-7y': createEmptyAgeGroupData(),
};