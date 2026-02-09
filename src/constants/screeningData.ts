import type { ScreeningData, Domain, DomainKey } from '../types';

// --- 輔助函式：產生空資料 ---
const createEmptyDomain = (name: string, key: DomainKey): Domain => ({
  name,
  key,
  cutoff: 0,
  questions: [],
});

// 修正：移除了未使用的 createEmptyAgeGroupData 函式，解決 TS6133 編譯錯誤

// --- 正式資料庫 ---
export const screeningData: ScreeningData = {
  
  // ==========================================
  // 1. 6-9 個月
  // ==========================================
  '6-9m': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 5,
      questions: [
        { 
          id: 'GM-6-9m-Q1', type: '實', weight: 1,
          text: '趴著時能用手肘或手掌支撐將上半身抬離床面？', 
          description: '觀察重點：能用手肘或手掌支撐抬起上半身，且頭部能維持穩定，不會搖晃。',
          emoji: '👶', kind: 'emoji' 
        },
        { 
          id: 'GM-6-9m-Q2', type: '實', weight: 1,
          text: '★ 可以翻身？', 
          description: '需可從「躺姿翻至趴姿」，且兩側皆可才算通過。',
          emoji: '🔄', kind: 'emoji' 
        },
        { 
          id: 'GM-6-9m-Q3', type: '實', weight: 1,
          text: '在些微輔助下能維持坐姿，且身體不會過度前傾？', 
          description: '呈現三點坐姿或獨立坐姿，身體不會過度前傾皆算通過。',
          emoji: '🧘', kind: 'emoji' 
        },
        { 
          id: 'GM-6-9m-Q4', type: '實', weight: 1,
          text: '牽引反射：由躺姿拉到坐姿時，頭部能與軀幹維持直線？', 
          description: '拉起過程中，頭部能跟著軀幹維持直線，不會向後仰 (No Head Lag)。',
          emoji: '📏', kind: 'emoji', 
          warning: '⚠️ 此動作涉及頸部安全，家長操作時請務必「緩慢輕柔」。若不確定如何操作，請勾選「交由醫師評估」。',
          allowDoctorAssessment: true
        },
        { 
          id: 'GM-6-9m-Q5', type: '實', weight: 2,
          text: '抬軀反射 (Landau)：腹部被托住時，頭與下肢能向上伸直？', 
          description: '呈現像「超人飛翔」的姿勢。測試重點：當壓下頭部時，腿部會跟著彎曲；放開頭部後，會恢復伸直。',
          emoji: '✈️', kind: 'emoji',
          warning: '⚠️ 安全警示：請務必在「軟墊」或「床鋪」上方進行，避免孩子滑落受傷。',
          allowDoctorAssessment: true 
        },
      ]
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 4,
      questions: [
        { 
          id: 'FM-6-9m-Q1', type: '問', weight: 1, 
          text: '可以用雙手握著物品（例如奶瓶）？', 
          description: '可以用雙手同時握著物品。', 
          emoji: '🍼', kind: 'emoji' 
        },
        { 
          id: 'FM-6-9m-Q2', type: '實', weight: 1,
          text: '手帕蓋在臉上時，會用單手拿開？', 
          description: '左右手均需測試。需能用單手將手帕拿開才算通過。',
          emoji: '🙈', kind: 'emoji' 
        },
        { 
          id: 'FM-6-9m-Q3', type: '實', weight: 2,
          text: '★ 大拇指可以伸直與外展，不會持續內縮握拳？', 
          description: '觀察孩子張開手時，大拇指可伸直離開掌心 (非拇指內扣)。',
          emoji: '👍', kind: 'emoji' 
        },
        { 
          id: 'FM-6-9m-Q4', type: '實', weight: 1,
          text: '可以耙抓小玩具？', 
          description: '可以用四指及掌心抓取 (雙手皆可)。',
          emoji: '🦀', kind: 'emoji' 
        },
      ]
    },
    cognitive_language: {
      name: '認知語言社會', key: 'cognitive_language', cutoff: 4,
      questions: [
        { 
          id: 'CL-6-9m-Q1', type: '實', weight: 1, 
          text: '○ 呼喊孩子名字或小名有反應？', 
          description: '有視線接觸或聲音回應。', 
          emoji: '👂', kind: 'emoji' 
        },
        { 
          id: 'CL-6-9m-Q2', type: '實', weight: 1, 
          text: '★ 拿玩具在面前搖晃並跨過中線移動，眼球會追視？', 
          description: '將玩具從一邊跨過身體中線移動到另一側，孩子眼球會追視也會伸手拿。', 
          emoji: '🧶', kind: 'emoji' 
        },
        { id: 'CL-6-9m-Q3', type: '實/問', weight: 1, text: '被逗弄說話時，有聲音回應？', emoji: '💬', kind: 'emoji' },
        { id: 'CL-6-9m-Q4', type: '實/問', weight: 1, text: '逗孩子時，他會笑得很開心？', emoji: '😆', kind: 'emoji' },
        { 
          id: 'CL-6-9m-Q5', type: '問', weight: 1, 
          text: '遇到不喜歡的食物會有抗拒行為？', 
          description: '例如：閉嘴、轉頭或推開。', 
          emoji: '🙅', kind: 'emoji' 
        },
      ]
    },
    // 此處為 6-9m 的空社會面向，計分引擎會自動過濾滿分為 0 的項目
    social: createEmptyDomain('社會發展', 'social'), 
  },

  // ==========================================
  // 2. 9-12 個月
  // ==========================================
  '9-12m': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 4,
      questions: [
        { 
          id: 'GM-9-12m-Q1', type: '實', weight: 1,
          text: '★ 能自己放手坐穩至少1分鐘，不會搖晃或跌倒？', 
          description: '能背部挺直且獨立坐穩至少 1 分鐘，不需以手臂或外力支撐。',
          emoji: '🧘', kind: 'emoji'
        },
        { 
          id: 'GM-9-12m-Q2', type: '實/問', weight: 1,
          text: '可以往前移動爬行一小段距離(至少30cm)？', 
          description: '可以胸部貼地匍匐前進，或胸部離地爬行皆可。',
          emoji: '🐢', kind: 'emoji'
        },
        { id: 'GM-9-12m-Q3', type: '實/問', weight: 1, text: '可以由躺或趴的姿勢自己坐起來？', description: '不需他人協助。', emoji: '🛌', kind: 'emoji' },
        { id: 'GM-9-12m-Q4', type: '實', weight: 1, text: '將雙手放在孩子腋下，稍加支撐孩子就能站得很挺？', emoji: '🧍', kind: 'emoji' },
        { 
          id: 'GM-9-12m-Q5', type: '實', weight: 1,
          text: '是否出現『降落傘反射』(Parachute Reflex)？', 
          description: '抱起孩子，將其身體突然向下衝(模擬跌倒)，觀察孩子是否會伸出雙手做出「支撐保護」的動作。',
          emoji: '🪂', kind: 'emoji',
          warning: '⚠️ 此動作需快速且注意安全，若家長不確定如何測試，請勾選「交由醫師評估」。',
          allowDoctorAssessment: true
        },
      ]
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 3,
      questions: [
        { 
          id: 'FM-9-12m-Q1', type: '實/問', weight: 1,
          text: '★ 會將玩具由一手換至另一手？', 
          description: '可在「身體中線處」將物品從一手換到另一手中，過程物品不會掉落。',
          emoji: '🤲', kind: 'emoji'
        },
        { 
          id: 'FM-9-12m-Q2', type: '實/問', weight: 1,
          text: '會用食指去戳或按東西？', 
          description: '例如：戳小洞、按玩具按鍵、開關。需有單獨伸出食指的動作。',
          emoji: '👆', kind: 'emoji'
        },
        { id: 'FM-9-12m-Q3', type: '實/問', weight: 1, text: '可以單手持續搖動玩具至少3下？', emoji: '🔔', kind: 'emoji' },
        { 
          id: 'FM-9-12m-Q4', type: '實', weight: 1,
          text: '能以拇指與食指(中指)對握方式抓握積木？', 
          description: '使用指尖或遠端指腹對握(可見清楚虎口)，而非用手掌一把抓。',
          emoji: '👌', kind: 'emoji'
        },
      ]
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 3,
      questions: [
        { id: 'CL-9-12m-Q1', type: '實/問', weight: 1, text: '會一手各拿一個玩具相互敲打？', emoji: '🥁', kind: 'emoji' },
        { id: 'CL-9-12m-Q2', type: '實/問', weight: 1, text: '玩具在孩子面前掉在視線外，孩子眼神會去找？', description: '有出現尋找積木的眼神或動作。', emoji: '👀', kind: 'emoji' },
        { id: 'CL-9-12m-Q3', type: '實/問', weight: 1, text: '出現多種語音組合(牙牙學語)，如 ba-ba, ma-ma？', description: '可以使用語音組合與聲調進行類溝通意圖。', emoji: '🗣️', kind: 'emoji' },
        { id: 'CL-9-12m-Q4', type: '實/問', weight: 1, text: '會舉雙手示意要抱抱？', emoji: '🙌', kind: 'emoji' },
      ]
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 4,
      questions: [
        { id: 'S-9-12m-Q1', type: '實/問', weight: 1, text: '★ 呼喊孩子名字或小名有反應？', description: '有視線或聲音反應。', emoji: '👂', kind: 'emoji' },
        { id: 'S-9-12m-Q2', type: '實/問', weight: 1, text: '會嘗試模仿大人的簡單動作或表情？', description: '例如：嘟嘴、拍手、拜拜等。', emoji: '👋', kind: 'emoji' },
        { id: 'S-9-12m-Q3', type: '實/問', weight: 1, text: '可以跟大人玩 peek-a-boo (躲貓貓) 的遊戲？', description: '看到大人玩會笑、顯得開心，或有互動回應意圖。', emoji: '🙈', kind: 'emoji' },
        { id: 'S-9-12m-Q4', type: '實', weight: 1, text: '看到醫生或陌生人會有怕生或害羞的反應？', description: '會看著醫師或照顧者，或有害羞反應。(若無親疏分別選否)', emoji: '😳', kind: 'emoji' },
        { id: 'S-9-12m-Q5', type: '實', weight: 1, text: '互動時，孩子和大人有目光接觸嗎？', emoji: '👁️', kind: 'emoji' },
      ]
    }
  },

  // ==========================================
  // 3. 12-15 個月
  // ==========================================
  '12-15m': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 3,
      questions: [
        { 
          id: 'GM-12-15m-Q1', type: '實/問', weight: 2,
          text: '★ 能自己扶著傢俱走或牽手走嗎？', 
          description: '能自己扶著傢俱側走，或大人「牽手掌」即可向前走 (不需扶手臂)。',
          emoji: '🪜', kind: 'emoji' 
        },
        { 
          id: 'GM-12-15m-Q2', type: '實/問', weight: 1,
          text: '可以(扶著傢俱)蹲下或彎腰撿起地上物品然後恢復站姿嗎？', 
          description: '跌坐在地板再站起來不算，需能蹲下取物後直接恢復站姿。',
          emoji: '⬇️', kind: 'emoji' 
        },
        { 
          id: 'GM-12-15m-Q3', type: '問', weight: 1,
          text: '可以爬上沙發或矮凳或樓梯嗎？', 
          description: '可以獨自爬上。⚠️ 家長請在旁注意防跌安全。',
          emoji: '🛋️', kind: 'emoji' 
        },
      ],
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 3,
      questions: [
        { 
          id: 'FM-12-15m-Q1', type: '實/問', weight: 2,
          text: '★ 可以用拇指及食指對握拿取貼紙或如葡萄乾大小的小東西？', 
          description: '使用指尖或指腹對握 (Pincer grasp)。\n❌ 僅用手掌抓取不算通過。',
          emoji: '👌', kind: 'emoji' 
        },
        { 
          id: 'FM-12-15m-Q2', type: '實/問', weight: 1,
          text: '可以把物品放在大人手中？', 
          description: '是「有意識地」輕放，而非不小心掉落或甩落。',
          emoji: '🤲', kind: 'emoji' 
        },
        { 
          id: 'FM-12-15m-Q3', type: '實/問', weight: 1,
          text: '能把物品放入寬口容器裡？', 
          description: '例如將積木放進直徑約 8-12 公分的玩具碗或馬克杯中。',
          emoji: '🥣', kind: 'emoji' 
        },
      ],
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 4,
      questions: [
        { 
          id: 'CL-12-15m-Q1', type: '實', weight: 1,
          text: '指著桌上貼紙說『你看，有...』，孩子可以立即看向該物品？', 
          description: '孩子眼神可以明確地看向大人指的物品 (Joint attention)。',
          emoji: '👀', kind: 'emoji' 
        },
        { 
          id: 'CL-12-15m-Q2', type: '實', weight: 1,
          text: '在孩子面前將貼紙或小玩具蓋起來(或藏在手中)，孩子會嘗試去找尋？', 
          description: '孩子會嘗試指出或拉起遮布找玩具。',
          emoji: '🔍', kind: 'emoji' 
        },
        { 
          id: 'CL-12-15m-Q3', type: '實/問', weight: 1,
          text: '可以在沒有手勢提示或示範下，聽懂簡單指令並做出回應？', 
          description: '例如：「拍手」、「坐下」、「過來」、「給我」。\n👉 施測指引：請勿做動作提示。',
          emoji: '👂', kind: 'emoji' 
        },
        { 
          id: 'CL-12-15m-Q4', type: '實/問', weight: 2,
          text: '★ 會說1-2個有意義的「詞彙」？', 
          description: '例如：爸爸、媽媽。需照顧者聽得懂，且有明確指稱對象。',
          emoji: '🗣️', kind: 'emoji' 
        },
        { 
          id: 'CL-12-15m-Q5', type: '實/問', weight: 1,
          text: '會發出 ba-ba, ma-ma, da-da 之類的聲音？', 
          description: '使用多種語音組合進行類溝通意圖。',
          emoji: '🎵', kind: 'emoji' 
        },
      ],
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 3, 
      questions: [
        { id: 'S-12-15m-Q1', type: '實/問', weight: 2, text: '★ 呼喊孩子名字或小名有反應？', description: '有視線或聲音反應。', emoji: '🙋', kind: 'emoji' },
        { id: 'S-12-15m-Q2', type: '實/問', weight: 1, text: '可以和大人玩肢體互動遊戲？', description: '例如交替擊掌 (high five) 或炒蘿蔔等遊戲。', emoji: '🙌', kind: 'emoji' },
        { id: 'S-12-15m-Q3', type: '實', weight: 1, text: '施測過程中，孩子可以眼神穩定地看向家長或施測者進行互動？', description: '眼神接觸穩定。', emoji: '👁️', kind: 'emoji' },
        { id: 'S-12-15m-Q4', type: '實', weight: 1, text: '離開時，跟孩子說『掰掰』，孩子會回應？', description: '有視覺或者掰掰手勢回應。(若沒回應可加做搖手掰掰動作)', emoji: '👋', kind: 'emoji' },
      ],
    },
  },

  // ==========================================
  // 4. 15-18 個月
  // ==========================================
  '15-18m': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 3,
      questions: [
        { 
          id: 'GM-15-18m-Q1', type: '實', weight: 1,
          text: '能放手走至少 2-3 步？', 
          description: '大人不需給予力量協助。',
          emoji: '🚶', kind: 'emoji' 
        },
        { 
          id: 'GM-15-18m-Q2', type: '實/問', weight: 2,
          text: '★ 能放手站至少 30 秒？', 
          description: '在不扶東西的情況下，能維持站立姿勢至少 30 秒。',
          emoji: '🧍', kind: 'emoji' 
        },
        { 
          id: 'GM-15-18m-Q3', type: '實', weight: 1,
          text: '放手走或扶走時步態是否正常？', 
          description: '觀察重點：沒有持續踮腳尖 (tip-toe)、沒有剪刀式步態 (雙腳交叉)、左右步態對稱。',
          emoji: '👣', kind: 'emoji', 
          allowDoctorAssessment: true 
        },
      ],
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 3,
      questions: [
        { 
          id: 'FM-15-18m-Q1', type: '實', weight: 2,
          text: '★ 能以「拇指與食指(中指)對握」方式抓握積木？', 
          description: '使用指尖或遠端指腹對握 (Pincer grasp)，而非僅用手掌抓。',
          emoji: '👌', kind: 'emoji' 
        },
        { 
          id: 'FM-15-18m-Q2', type: '實', weight: 1,
          text: '可以拿筆在紙上隨意塗鴉？', 
          description: '能握筆在紙上畫出連續超過 2.5cm 的筆跡。',
          emoji: '🖍️', kind: 'emoji' 
        },
        { 
          id: 'FM-15-18m-Q3', type: '問', weight: 1,
          text: '會嘗試使用家中常見物品？', 
          description: '例如：嘗試拿湯匙/叉子靠近嘴巴、拿杯子喝水等動作。',
          emoji: '🥄', kind: 'emoji' 
        },
      ],
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 3,
      questions: [
        { 
          id: 'CL-15-18m-Q1', type: '實/問', weight: 2,
          text: '★ 可以沒有手勢提示下，聽懂簡單指令並回應？', 
          description: '例如：「拿ＯＯ」、「關門」、「打開」等，大人不可以用手比，孩子能聽懂並照做。',
          emoji: '👂', kind: 'emoji' 
        },
        { 
          id: 'CL-15-18m-Q2', type: '實/問', weight: 1,
          text: '孩子會用自己的「食指」來指向想要的物品？', 
          description: '是用食指指，而非拉大人的手或用整個手掌去比。',
          emoji: '👆', kind: 'emoji' 
        },
        { 
          id: 'CL-15-18m-Q3', type: '實/問', weight: 1,
          text: '會用口語或肢體動作(點頭或搖頭)表示「要」或「不要」？', 
          description: '能明確表達需求或拒絕。',
          emoji: '🙅', kind: 'emoji' 
        },
        { 
          id: 'CL-15-18m-Q4', type: '實/問', weight: 1,
          text: '會說五個以上有意義的「詞彙」？', 
          description: '要是照顧者聽得懂的有意義詞彙，單純仿說或無意義的發音不算。',
          emoji: '🗣️', kind: 'emoji' 
        },
      ],
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 3,
      questions: [
        { 
          id: 'S-15-18m-Q1', type: '實', weight: 2,
          text: '★ 呼喊孩子名字或小名有反應？', 
          description: '呼喚時有視線接觸或聲音回應。',
          emoji: '🙋', kind: 'emoji' 
        },
        { 
          id: 'S-15-18m-Q2', type: '實/問', weight: 1,
          text: '可以模仿別人的動作？', 
          description: '例如：拍手、敲打、拜拜等簡單動作。',
          emoji: '👋', kind: 'emoji' 
        },
        { 
          id: 'S-15-18m-Q3', type: '實', weight: 1,
          text: '孩子有怕生、害羞或對外在環境有眼神觀察的行為表現？', 
          description: '請選「是」：這代表孩子有正常的社交警覺性。\n若孩子對陌生人/環境「完全不理會、無反應」，請選「否」。',
          warning: '💡 發展提示：此階段孩子出現怕生是正常的依附關係表現，反而是「完全不怕生」或「無視他人」需要關注。',
          allowDoctorAssessment: true 
        },
        { 
          id: 'S-15-18m-Q4', type: '實', weight: 1,
          text: '離開時跟孩子說「掰掰」，孩子會回應？', 
          description: '有視覺注視或者揮手掰掰的回應皆可。',
          emoji: '🚪', kind: 'emoji' 
        },
      ],
    },
  },

  // ==========================================
  // 5. 18-24 個月
  // ==========================================
  '18-24m': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 3,
      questions: [
        { 
          id: 'GM-18-24m-Q1', type: '實', weight: 2, 
          text: '★ 可以放手走得很穩？', 
          description: '可以走得很穩超過10步以上，不會搖搖晃晃，也不需張開手保持平衡。', 
          emoji: '🚶', kind: 'emoji' 
        },
        { 
          id: 'GM-18-24m-Q2', type: '實', weight: 1, 
          text: '走路步態是否正常？', 
          description: '觀察重點：雙腳與肩同寬，手自然下垂。無持續踮腳尖 (tip-toe) 或剪刀式步態 (scissor gait)。', 
          emoji: '👣', kind: 'emoji',
          allowDoctorAssessment: true 
        },
        { 
          id: 'GM-18-24m-Q3', type: '實', weight: 1, 
          text: '可以自行蹲下後再站起來？', 
          description: '不扶物即可蹲下，起身時也不需手撐膝蓋 (Gowers\'s sign)。', 
          emoji: '⬇️', kind: 'emoji' 
        },
      ],
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 3,
      questions: [
        { 
          id: 'FM-18-24m-Q1', type: '實/問', weight: 1, 
          text: '嘗試打開蓋子？', 
          description: '大人不幫忙固定容器時，孩子能自己拿著容器，有嘗試打開（掀開、轉開、鬆開皆可）的動作。', 
          emoji: '🧴', kind: 'emoji' 
        },
        { 
          id: 'FM-18-24m-Q2', type: '實', weight: 2, 
          text: '★ 可以疊至少 2 塊積木？', 
          description: '使用拇指及食(中)指對握拿取積木，並疊高至少兩塊。(非用手掌抓)', 
          emoji: '🧱', kind: 'emoji' 
        },
        { 
          id: 'FM-18-24m-Q3', type: '實/問', weight: 1, 
          text: '可以穩定將圓形/三角形/正方形放入對應形狀板(桶)？', 
          description: '不示範下獨自完成至少一種形狀。(60秒內)', 
          emoji: '🔺', kind: 'emoji' 
        },
        { 
          id: 'FM-18-24m-Q4', type: '實', weight: 1, 
          text: '可以打開繪本翻頁？', 
          description: '可以一頁頁翻書（一次翻一頁，至少翻 2 頁）。', 
          emoji: '📖', kind: 'emoji' 
        },
      ],
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 5,
      questions: [
        { 
          id: 'CL-18-24m-Q1', type: '實', weight: 1, 
          text: '會指出至少三個身體部位？', 
          description: '例如：眼睛、嘴巴、手。完全不理會或指錯不算通過。', 
          emoji: '👀', kind: 'emoji' 
        },
        { 
          id: 'CL-18-24m-Q2', type: '實', weight: 2, 
          text: '★ (圖卡1) 指著圖卡問『你看！○○在哪裡？』', 
          description: '可穩定答對至少三題 (湯匙、小狗、汽車、皮球)。\n👉 施測指引：大人問，孩子指認。', 
          kind: 'multi_image',
          flashcardOptions: [
            { label: '湯匙', imageSrc: '/assets/card1_spoon.png', bgColor: 'bg-rose-50' },
            { label: '小狗', imageSrc: '/assets/card1_dog.png', bgColor: 'bg-amber-50' },
            { label: '汽車', imageSrc: '/assets/card1_car.png', bgColor: 'bg-sky-50' },
            { label: '皮球', imageSrc: '/assets/card1_ball.png', bgColor: 'bg-emerald-50' },
          ]
        },
        { 
          id: 'CL-18-24m-Q3', type: '實', weight: 1, 
          text: '○ (圖卡1) 指著圖卡問『這是什麼？』', 
          description: '可穩定答對至少三題。大人聽得懂意義即可。\n👉 施測指引：大人指，孩子回答名稱。', 
          kind: 'multi_image',
          flashcardOptions: [
            { label: '湯匙', imageSrc: '/assets/card1_spoon.png', bgColor: 'bg-rose-50' },
            { label: '小狗', imageSrc: '/assets/card1_dog.png', bgColor: 'bg-amber-50' },
            { label: '汽車', imageSrc: '/assets/card1_car.png', bgColor: 'bg-sky-50' },
            { label: '皮球', imageSrc: '/assets/card1_ball.png', bgColor: 'bg-emerald-50' },
          ]
        },
        { 
          id: 'CL-18-24m-Q4', type: '實/問', weight: 1, 
          text: '會穩定說出 10 個(含)以上有意義的詞彙？', 
          description: '只能仿說不算。', 
          emoji: '🗣️', kind: 'emoji' 
        },
        { 
          id: 'CL-18-24m-Q5', type: '實/問', weight: 1, 
          text: '○ 會說的有意義詞彙至少有 2 個(含)以上？', 
          description: '若已通過上一題 (10個詞彙)，此題自動通過。', 
          emoji: '💬', kind: 'emoji' 
        },
      ],
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 4,
      questions: [
        { 
          id: 'S-18-24m-Q1', type: '實', weight: 2, 
          text: '★ 呼喊孩子名字或小名可以穩定反應？', 
          description: '每次呼喊皆有穩定視線或聲音反應。', 
          emoji: '🙋', kind: 'emoji' 
        },
        { 
          id: 'S-18-24m-Q2', type: '實', weight: 1, 
          text: '詢問孩子『OO在哪裡？』孩子會去看向物品方向或用手比？', 
          description: '例如問：門在哪裡？燈在哪裡？孩子能看或指向詢問的物品。', 
          emoji: '👉', kind: 'emoji' 
        },
        { 
          id: 'S-18-24m-Q3', type: '問', weight: 1, 
          text: '會使用至少一種常見的生活用品？', 
          description: '例如：拿手機靠近耳朵、拿梳子梳頭髮、拿杯子喝水。仿大人使用方式。', 
          emoji: '📱', kind: 'emoji' 
        },
        { 
          id: 'S-18-24m-Q4', type: '問', weight: 1, 
          text: '玩遊戲時會有假扮的玩法？', 
          description: '例如餵娃娃喝水或假裝餵大人吃東西等。', 
          emoji: '🧸', kind: 'emoji' 
        },
      ],
    },
  },

  // ==========================================
  // 6. 2-3 歲
  // ==========================================
  '2-3y': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 3,
      questions: [
        { 
          id: 'GM-2-3y-Q1', type: '實/問', weight: 2, 
          text: '★ 可以自己稍微扶著欄杆或放手走上樓梯？', 
          description: '不需他人牽扶。可以獨自放手(或僅稍微扶著欄杆)走上樓梯，溜滑梯的小階梯也可以。', 
          emoji: '🪜', kind: 'emoji' 
        },
        { 
          id: 'GM-2-3y-Q2', type: '實/問', weight: 1, 
          text: '可以單手向前丟球？', 
          description: '請使用約網球大小(直徑6-7cm)的球。能單手將球丟出且有瞬間加速的動作。\n⚠️ 注意：若「只將球向下放掉」或「用雙手丟」不算通過。', 
          emoji: '🎾', kind: 'emoji' 
        },
        { 
          id: 'GM-2-3y-Q3', type: '實/問', weight: 1, 
          text: '可以雙腳離地跳？', 
          description: '雙腳可以同時離地跳起，或者稍微牽扶著也能跳起。', 
          emoji: '🐰', kind: 'emoji' 
        },
      ],
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 4, 
      questions: [
        { 
          id: 'FM-2-3y-Q1', type: '實', weight: 2, 
          text: '★ 可以疊高至少4塊積木？', 
          description: '請準備至少 8 塊積木(約2-3cm)在桌上。\n👉 施測指引：大人先示範疊高，再請孩子嘗試操作。', 
          emoji: '🧱', kind: 'emoji' 
        },
        { 
          id: 'FM-2-3y-Q2', type: '實', weight: 1, 
          text: '孩子可以獨立用手把小罐子的瓶蓋完全旋開？', 
          description: '瓶口建議約 3.5 公分，旋轉螺紋約 2-3 圈。需能「完全旋開」才算通過。', 
          emoji: '🧴', kind: 'emoji' 
        },
        { 
          id: 'FM-2-3y-Q3', type: '問', weight: 1, 
          text: '孩子可以自己用湯匙吃飯？', 
          description: '可以獨自使用湯匙舀起食物並放入嘴巴 (過程中少量灑出或溢出是可以接受的)。', 
          emoji: '🥄', kind: 'emoji' 
        },
        { 
          id: 'FM-2-3y-Q4', type: '實', weight: 1, 
          text: '孩子可以拿筆連續畫圈或直線/橫線或是鋸齒線？', 
          description: '觀察孩子畫出的線條，只要能畫出連續線條 (如螺圓形、Z字型、直線或橫線皆可)，且筆跡連續超過 5 公分即算通過。', 
          emoji: '🖍️', kind: 'emoji' 
        },
      ],
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 4, 
      questions: [
        { 
          id: 'CL-2-3y-Q1', type: '問', weight: 1, 
          text: '孩子會把不同功能的玩具搭配著一起玩？', 
          description: '例如：用車子載積木、把娃娃放到床上、把食物放進盤子裡等。', 
          emoji: '🧸', kind: 'emoji' 
        },
        { 
          id: 'CL-2-3y-Q2', type: '實', weight: 2, 
          text: '★ (圖卡2) 指認洗手、踢球、喝水、拍手？', 
          description: '指著圖卡問：「誰在洗手？誰在踢球？誰在喝水？誰在拍手？」。\n需能指認或回答正確至少三題。',
          kind: 'multi_image',
          flashcardOptions: [
            { label: '踢球', imageSrc: '/assets/card2_kick.png', bgColor: 'bg-rose-50' },
            { label: '喝水', imageSrc: '/assets/card2_drink.png', bgColor: 'bg-amber-50' },
            { label: '洗手', imageSrc: '/assets/card2_wash.png', bgColor: 'bg-sky-50' },
            { label: '拍手', imageSrc: '/assets/card2_clap.png', bgColor: 'bg-emerald-50' },
          ]
        },
        { 
          id: 'CL-2-3y-Q3', type: '實', weight: 2, 
          text: '★ (圖卡2) 孩子可以用片語或句子描述圖卡內容？', 
          description: '例如說出：「洗手(玩水)」、「踢足球(玩球)」、「拿杯子」、「喝水」、「拍手」等。\n需至少用「動詞+名詞」的組合描述，並答對至少三題。', 
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
      name: '社會發展', key: 'social', cutoff: 4, 
      questions: [
        { 
          id: 'S-2-3y-Q1', type: '實', weight: 2, 
          text: '★ 孩子對自己的名字或小名有反應？', 
          description: '當名字或小名被呼喚時，可以很穩定地回應 (視線或聲音皆可)。', 
          emoji: '👂', kind: 'emoji' 
        },
        { 
          id: 'S-2-3y-Q2', type: '問', weight: 2, 
          text: '★ 玩遊戲時會有假扮的玩法？', 
          description: '常有假扮遊戲，例如：餵娃娃喝水、假裝餵大人吃東西、假裝打電話等。', 
          emoji: '🎭', kind: 'emoji' 
        },
        { 
          id: 'S-2-3y-Q3', type: '問', weight: 1, 
          text: '看到其他人有情緒變化時，會有反應？', 
          description: '例如：看到別人生氣或傷心時，孩子會停下動作關注，或出現表情上的變化。', 
          emoji: '👶', kind: 'emoji' 
        },
      ],
    },
  },

  // ==========================================
  // 7. 3-4 歲 (量表七)
  // ==========================================
  '3-4y': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 4,
      questions: [
        { 
          id: 'GM-3-4y-Q1', type: '問', weight: 1,
          text: '可以獨自上下樓梯，不需扶欄杆或是大人牽手協助？', 
          description: '只會獨自上樓但還不會下樓不算。需能放手自己走上樓及下樓。',
          emoji: '🪜', kind: 'emoji'
        },
        { 
          id: 'GM-3-4y-Q2', type: '問', weight: 1,
          text: '可以穩穩地跑2公尺？', 
          description: '可以穩穩地向前跑至少 2 公尺距離 (非快走)。',
          emoji: '🏃', kind: 'emoji'
        },
        { 
          id: 'GM-3-4y-Q3', type: '實/問', weight: 1,
          text: '可以單手過肩丟小球2公尺？', 
          description: '能用單手將球舉過肩將球丟出至少 2 公尺遠。(用雙手或向上面拋出皆不算)',
          emoji: '⚾', kind: 'emoji'
        },
        { 
          id: 'GM-3-4y-Q4', type: '實', weight: 2,
          text: '★ 可以雙腳同時離地連續跳躍至少2下？', 
          description: '雙腳必須「同時離地」，且連續跳躍至少 2 下。',
          emoji: '🐰', kind: 'emoji'
        }
      ]
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 2,
      questions: [
        { 
          id: 'FM-3-4y-Q1', type: '實', weight: 2,
          text: '★ 可以拿筆模仿畫出圓形？', 
          description: '可以照著仿畫出圓形，且筆觸的起點及終點可以連接無缺口。',
          emoji: '⭕', kind: 'emoji'
        },
        { 
          id: 'FM-3-4y-Q2', type: '實', weight: 1,
          text: '可以模仿疊出『品』或『田』的形狀？', 
          description: '用 3-4 塊積木仿疊。示範後不要推倒，讓孩子看著疊。',
          emoji: '🧱', kind: 'emoji'
        },
        { 
          id: 'FM-3-4y-Q3', type: '實', weight: 1,
          text: '可以單手將兩枚十元硬幣一次一個收入同一手掌中？', 
          description: '需準備 2 枚 10 元硬幣。使用單手將兩枚硬幣一次一個從指尖收進掌心。使用雙手或掉出皆不算通過。',
          emoji: '🪙', kind: 'emoji'
        }
      ]
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 3,
      questions: [
        { 
          id: 'CL-3-4y-Q1', type: '實', weight: 1,
          text: '可以和人一問一答持續對話，且回答內容切題？', 
          description: '例：「你喜歡玩什麼？」。需句型完整 (主詞+動詞+受詞)，且回答切題。',
          emoji: '🗣️', kind: 'emoji'
        },
        { 
          id: 'CL-3-4y-Q2', type: '實', weight: 1,
          text: ' (圖卡3) 孩子可以看圖描述內容？', 
          description: '可以至少以 3-4 個詞彙的句子正確敘述圖卡內容 (主詞+動詞+受詞)。',
          emoji: '🖼️', kind: 'image',
          imageSrc: '/assets/card3_combined.png'
        },
        { 
          id: 'CL-3-4y-Q3', type: '實', weight: 2,
          text: '★ (圖卡3) 指著球問：『哪一個球比較大？』', 
          description: '孩子能正確指出或說出「紅色球比較大」。',
          emoji: '⚖️', kind: 'image',
          imageSrc: '/assets/card3_combined.png'
        },
        { 
          id: 'CL-3-4y-Q4', type: '問', weight: 1,
          text: '爸媽(或主要照顧者)都聽得懂孩子的話？', 
          description: '構音可以不用非常標準，但主要照顧者聽得懂即可。',
          emoji: '👂', kind: 'emoji'
        }
      ]
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 4,
      questions: [
        { 
          id: 'S-3-4y-Q1', type: '實', weight: 2,
          text: '★ 可以回答出自己的名字或年齡？', 
          description: '正確回答出名字(小名)或年齡 (用手指比也可以，回答虛歲也算對)。',
          emoji: '🙋', kind: 'emoji'
        },
        { 
          id: 'S-3-4y-Q2', type: '實', weight: 1,
          text: '互動過程中，孩子的眼神可以穩定看著施測者或家長？', 
          description: '整個互動過程中，孩子的眼神可以穩定看著施測者或家長回答問題。',
          emoji: '👁️', kind: 'emoji'
        },
        { 
          id: 'S-3-4y-Q3', type: '問', weight: 1,
          text: '已經建立簡單的生活常規？', 
          description: '例：說「要出門了」，孩子知道要去拿鞋子。',
          emoji: '👟', kind: 'emoji'
        },
        { 
          id: 'S-3-4y-Q4', type: '問', weight: 1,
          text: '會想和(熟悉的)孩子或同學一起玩？', 
          description: '可以加入同儕的遊戲，出現聯合遊戲 (Associative Play) 行為。',
          emoji: '🤝', kind: 'emoji'
        }
      ]
    }
  },
  
  // ==========================================
  // 8. 4-5 歲 (量表八)
  // ==========================================
  '4-5y': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 4,
      questions: [
        {
          id: 'GM-4-5y-Q1', type: '問', weight: 1,
          text: '可以自己放手一腳一階上下樓梯？',
          description: '只能上樓不算通過。需可以放手自己一腳一階上樓及下樓。',
          emoji: '🪜', kind: 'emoji'
        },
        {
          id: 'GM-4-5y-Q2', type: '實', weight: 1,
          text: '可以交替跨步走直線？',
          description: '可以交替跨步走一直線 (可以不用 Tandem gait)。',
          emoji: '📏', kind: 'emoji'
        },
        {
          id: 'GM-4-5y-Q3', type: '實', weight: 2,
          text: '★ 能穩定地單腳站至少 3 秒？',
          description: '在無任何支撐下，可以穩定不搖晃地以單腳站立至少 3 秒鐘 (雙腳均需達標)。',
          emoji: '🦩', kind: 'emoji'
        },
        {
          id: 'GM-4-5y-Q4', type: '實', weight: 1,
          text: '可以穩定地單腳跳至少 2 下？',
          description: '在無任何支撐下，可以穩定地以單腳連續跳躍至少兩下 (雙腳均需達標)。',
          emoji: '🐇', kind: 'emoji'
        }
      ]
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 3,
      questions: [
        {
          id: 'FM-4-5y-Q1', type: '實', weight: 1,
          text: '可以模仿大人將紙對摺一半，並且壓出摺痕？',
          description: '對摺邊緣可以不用完全對齊，但需壓出摺痕。',
          emoji: '📄', kind: 'emoji'
        },
        {
          id: 'FM-4-5y-Q2', type: '實', weight: 2,
          text: '★ 可以使用剪刀連續向前剪至少 10 公分長？',
          description: '剪刀下刀處要連續穩定 (不可用小碎剪)。剪完距離線條最寬處偏移不超過 0.8 公分。',
          warning: '使用剪刀時請家長全程注意安全。',
          emoji: '✂️', kind: 'emoji'
        },
        {
          id: 'FM-4-5y-Q3', type: '實', weight: 2,
          text: '★ (圖卡4) 可以看著圖形照著畫出一樣的形狀 (十字/正方形)？',
          description: '4 歲：至少可以畫出十字。4.5 歲：至少可以畫出方形。',
          emoji: '🟩', kind: 'image',
          imageSrc: '/assets/card4_shapes.png'
        }
      ]
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 4,
      questions: [
        {
          id: 'CL-4-5y-Q1', type: '實', weight: 1,
          text: '可以和人一問一答持續對話，且回答內容切題？',
          description: '至少能以 4-5 個詞彙以上的完整句子敘述 (包含主詞+動詞+受詞)。',
          emoji: '🗣️', kind: 'emoji'
        },
        {
          id: 'CL-4-5y-Q2', type: '實', weight: 2,
          text: '★ (圖卡5-8) 可以用完整句子敘述故事情節？',
          description: '請孩子看圖描述圖卡內容。標準：1. 完整句子(4-5詞彙) 2. 語法正確 3. 使用連接詞(因為/所以/然後)。',
          kind: 'carousel',  // ✅ 改成輪播
          carouselImages: [  // ✅ 使用圖片陣列
            '/assets/card5_story.png',
            '/assets/card6_story.png',
            '/assets/card7_story.png',
            '/assets/card8_story.png'
          ]
        },
        {
          id: 'CL-4-5y-Q3', type: '實', weight: 1,
          text: ' (圖卡5) 指著圖卡問『什麼在桌子下面？』，孩子能正確回答？',
          description: '指或說出「球」。',
          emoji: '⚽', kind: 'image',
          imageSrc: '/assets/card5_story.png'
        },
        {
          id: 'CL-4-5y-Q4', type: '實', weight: 1,
          text: ' (圖卡5) 能『指認』出圖卡小球的 4 種顏色？',
          description: '能夠正確說或指出四種顏色：紅、黃、藍、綠。',
          emoji: '🌈', kind: 'image',
          imageSrc: '/assets/card5_story.png'
        },
        {
          id: 'CL-4-5y-Q5', type: '實', weight: 1,
          text: '孩子構音清晰？',
          description: '請跟唸：「三」、「八」、「狗」、「阿公」、「喝水」、「蛋糕」、「車」、「兔子」。需全部正確。',
          emoji: '🎤', kind: 'emoji'
        }
      ]
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 4,
      questions: [
        {
          id: 'S-4-5y-Q1', type: '問', weight: 1,
          text: '(反向題) 孩子常不害怕危險，爬高或從高處跳下？',
          description: '請勾選「是」欄位若孩子「不常」爬高爬低。(此為反向題：若孩子有危險行為選否，無危險行為選是)',
          emoji: '⚠️', kind: 'emoji'
        },
        {
          id: 'S-4-5y-Q2', type: '問', weight: 1,
          text: '有角色扮演以及有情境的家家酒？',
          description: '例如假裝老闆賣東西或當醫生幫娃娃打針。',
          emoji: '🎭', kind: 'emoji'
        },
        {
          id: 'S-4-5y-Q3', type: '實', weight: 2,
          text: '★ 施測過程中，孩子的眼神可以穩定看著施測者或家長？',
          description: '不會短暫注視後就看向他處或完全不看。',
          emoji: '👁️', kind: 'emoji'
        },
        {
          id: 'S-4-5y-Q4', type: '實', weight: 1,
          text: '施測過程中，孩子可以穩定地坐在位置上？',
          description: '不會在診間走來走去，坐不住。',
          emoji: '🪑', kind: 'emoji'
        }
      ]
    }
  },

  // ==========================================
  // 9. 5-7 歲 (量表九)
  // ==========================================
  '5-7y': {
    gross_motor: {
      name: '粗大動作', key: 'gross_motor', cutoff: 3,
      questions: [
        {
          id: 'GM-5-7y-Q1', type: '實', weight: 2,
          text: '★ 能穩定地單腳站至少 5 秒？',
          description: '在無任何支撐下，可以穩定不搖晃地以單腳站立至少 5 秒鐘 (雙腳均需達標)。',
          emoji: '🦩', kind: 'emoji'
        },
        {
          id: 'GM-5-7y-Q2', type: '實', weight: 1,
          text: '能單腳跳至少 5 下 (6歲10下)？',
          description: '雙腳均需輪流測試。5歲：單腳連續跳5下；6歲：單腳連續跳10下。',
          emoji: '🐇', kind: 'emoji'
        },
        {
          id: 'GM-5-7y-Q3', type: '實', weight: 1,
          text: '能腳跟接著腳尖交替向前走 5 步？',
          description: '可以腳跟接著腳尖 (Tandem gait) 交替向前走 5 步(含)以上，身體穩定不搖晃。',
          emoji: '🚶', kind: 'emoji'
        }
      ]
    },
    fine_motor: {
      name: '精細動作', key: 'fine_motor', cutoff: 4,
      questions: [
        {
          id: 'FM-5-7y-Q1', type: '實', weight: 2,
          text: '★ (圖卡4) 可以看著指定圖形照著畫出？',
          description: '5歲：畫出三角形。6歲：畫出菱形。邊角需清楚明顯。',
          emoji: '✏️', kind: 'image',
          imageSrc: '/assets/card4_shapes.png'
        },
        {
          id: 'FM-5-7y-Q2', type: '實', weight: 1,
          text: '能使用前三指握筆畫圖？',
          description: '可以使用前三指遠端握筆（靜態、動態三指握筆皆可）。',
          emoji: '✍️', kind: 'emoji'
        },
        {
          id: 'FM-5-7y-Q3', type: '實', weight: 1,
          text: '能單手將手掌中三枚十元硬幣用拇指推至指尖？',
          description: '【需準備 3 枚 10 元硬幣】手握三枚硬幣，運用拇指將硬幣一枚一枚推出至指尖放置桌上。',
          emoji: '🪙', kind: 'emoji'
        },
        {
          id: 'FM-5-7y-Q4', type: '實/問', weight: 1,
          text: '能將自己外套拉鍊兜好並拉起？',
          description: '能獨立將拉鍊頭插入拉鍊座，並拉起到靠近腋下之高度。',
          emoji: '🧥', kind: 'emoji'
        }
      ]
    },
    cognitive_language: {
      name: '認知語言發展', key: 'cognitive_language', cutoff: 5,
      questions: [
        {
          id: 'CL-5-7y-Q1', type: '實', weight: 2,
          text: '★ (圖卡5-8) 可以用完整句子敘述故事情節？',
          description: '需符合：1.完整句子(4-5詞彙) 2.語法正確 3.有連接詞 4.一問一答至少3次。',
          kind: 'carousel',  // ✅ 改成輪播
          carouselImages: [  // ✅ 使用圖片陣列
            '/assets/card5_story.png',
            '/assets/card6_story.png',
            '/assets/card7_story.png',
            '/assets/card8_story.png'
          ]
        },
        {
          id: 'CL-5-7y-Q2', type: '實', weight: 1,
          text: ' (圖卡5-8) 能正確描述圖卡中的因果關係？',
          description: '例如：「因為受傷了所以媽媽幫他擦藥」或回答「為什麼」的問題。',
          kind: 'image',
          imageSrc: '/assets/card7_story.png'
        },
        {
          id: 'CL-5-7y-Q3', type: '實', weight: 1,
          text: ' (圖卡9) 可以正確說出或指出阿拉伯數字 1-5？',
          description: '能正確辨認數字 1 到 5。',
          emoji: '🔢', kind: 'image',
          imageSrc: '/assets/card9_numbers.png'
        },
        {
          id: 'CL-5-7y-Q4', type: '實', weight: 1,
          text: ' (圖卡5) 可以正確數出桌子下的小球數量？',
          description: '能一一點數並回答總共有 8 顆。',
          emoji: '⚽', kind: 'image',
          imageSrc: '/assets/card5_story.png'
        },
        {
          id: 'CL-5-7y-Q5', type: '實', weight: 1,
          text: '孩子構音清晰？',
          description: '跟讀：三、八、狗、阿公、喝水、蛋糕、車、兔子。需全部正確。',
          emoji: '🗣️', kind: 'emoji'
        }
      ]
    },
    social: {
      name: '社會發展', key: 'social', cutoff: 4,
      questions: [
        {
          id: 'S-5-7y-Q1', type: '問', weight: 1,
          text: '可以遵守遊戲規則，參與團體活動？',
          description: '例如桌遊、闖關遊戲等需要互動、合作的活動。',
          emoji: '🎲', kind: 'emoji'
        },
        {
          id: 'S-5-7y-Q2', type: '問', weight: 1,
          text: '可以輪流玩遊戲或有耐心排隊？',
          description: '可以輪流、排隊，且不隨意中斷別人說話。',
          emoji: '⏳', kind: 'emoji'
        },
        {
          id: 'S-5-7y-Q3', type: '問', weight: 1,
          text: '有許多角色扮演遊戲的玩法？',
          description: '與人互動玩角色扮演（如醫生、廚師），且玩法多變。',
          emoji: '🎭', kind: 'emoji'
        },
        {
          id: 'S-5-7y-Q4', type: '問', weight: 1,
          text: '靜態專注力可以穩定持續超過 10 分鐘？',
          description: '在大多數時間、不同場所下，做靜態活動可持續 10 分鐘以上。',
          emoji: '📖', kind: 'emoji'
        },
        {
          id: 'S-5-7y-Q5', type: '實', weight: 1,
          text: '施測過程中，眼神可以穩定看著施測者？',
          description: '回答問題時，眼神能穩定注視，不會飄移或不看人。',
          emoji: '👁️', kind: 'emoji'
        },
        {
          id: 'S-5-7y-Q6', type: '實', weight: 1,
          text: '施測過程中，可以穩定坐在位置上？',
          description: '不會在診間走來走去或坐不住。',
          emoji: '🪑', kind: 'emoji'
        }
      ]
    }
  },
};