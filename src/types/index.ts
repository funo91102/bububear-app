// src/types/index.ts

/**
 * 1. 頁面狀態
 */
export type Screen = 'welcome' | 'confirmation' | 'tool_prep' | 'assessment' | 'feedback' | 'results';

/**
 * 2. 兒童基本資料
 */
export interface ChildProfile {
  nickname: string;
  birthDate: string;
  gestationalAge: number;
}

/**
 * 3. 題目與圖卡
 */
export type QuestionType = '實' | '問' | '實/問';

// ✨ 新增：定義題目種類 (為未來的 Discriminated Union 重構做準備)
export type QuestionKind = 'emoji' | 'single_image' | 'multi_image';

export interface FlashcardOption {
  label: string;
  imageSrc: string;
  bgColor: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  weight: number;
  description?: string;
  
  // 安全與評估設定
  warning?: string;                // 安全警示文字 (例如 Landau 反射的危險提示)
  allowDoctorAssessment?: boolean; // 是否顯示「交由醫師評估」按鈕
  
  // UI 呈現相關 (目前是混用的，未來將透過 kind 區分)
  kind?: QuestionKind;             // ✨ 新增：題目種類標籤 (Optional)
  emoji?: string;
  flashcard?: string | string[]; 
  flashcardOptions?: FlashcardOption[];
  flashcardImageSrc?: string; 
}

/**
 * 4. 發展領域與年齡分組
 */
export type DomainKey = 'gross_motor' | 'fine_motor' | 'cognitive_language' | 'social';

export interface Domain {
  name: string;
  key: DomainKey;
  questions: Question[];
  cutoff: number;
  maxScore: number;
}

export type AgeGroupKey = 
  | '6-9m' 
  | '9-12m' 
  | '12-15m' 
  | '15-18m' 
  | '18-24m' 
  | '2-3y' 
  | '3-4y' 
  | '4-5y' 
  | '5-7y';

export interface AgeGroupData {
  gross_motor: Domain;
  fine_motor: Domain;
  cognitive_language: Domain;
  social: Domain;
}

export type ScreeningData = Record<AgeGroupKey, AgeGroupData>;

/**
 * 5. 答案與結果
 */
// 'doctor_assessment' 狀態，用於標記略過並轉介醫師的題目
export type AnswerStatus = 'pass' | 'fail' | 'refused' | 'unanswered' | 'doctor_assessment';

export type Answers = Record<string, AnswerStatus>;

export type AssessmentStatus = 'max' | 'pass' | 'fail';

export interface Feedback {
  anxietyScore: number;
  notes: string;
}

export interface AssessmentResult {
  domainScores: Record<DomainKey, number>;
  domainStatuses: Record<DomainKey, AssessmentStatus>;
  overallStatus: 'normal' | 'follow_up' | 'referral';
}