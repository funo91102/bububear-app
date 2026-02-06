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
 * 3. 題目與圖卡 - 核心定義區 ✨
 */
export type QuestionType = '實' | '問' | '實/問' | 'observation' | 'interview' | 'mixed';

export type QuestionKind = 'emoji' | 'image' | 'single_image' | 'multi_image';

export interface FlashcardOption {
  label: string;
  imageSrc: string;
  bgColor: string;
}

export interface Question {
  id: string; 
  type: QuestionType;
  text: string;
  weight?: number;      // 預設為 1
  description?: string; // 施測指引
  warning?: string;                
  allowDoctorAssessment?: boolean; 
  kind?: QuestionKind | string; 
  emoji?: string;                        
  imageSrc?: string;                     
  flashcardImageSrc?: string;            
  flashcardOptions?: FlashcardOption[];  
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
}

export type AgeGroupKey = 
  | '6-9m' | '9-12m' | '12-15m' | '15-18m' | '18-24m' | '2-3y' | '3-4y' | '4-5y' | '5-7y';

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

// ✅ 標準化單題狀態名稱
export type StandardAnswerStatus = 'pass' | 'fail' | 'refused' | 'unanswered' | 'doctor_assessment';

// ✅ 定義原始輸入值聯合型別 (修復 TS 報錯關鍵)
export type RawAnswerValue = 
  | StandardAnswerStatus 
  | 'max' 
  | number  
  | string  
  | boolean 
  | null
  | undefined;

// ✅ 更新 Answers 型別以容納原始輸入
export type Answers = Record<string, RawAnswerValue>;

export type AssessmentStatus = 'max' | 'pass' | 'fail';

export interface Feedback {
  anxietyScore: number;
  notes: string;
}

export interface AssessmentResult {
  domainScores: Record<DomainKey, number>;
  domainStatuses: Record<DomainKey, AssessmentStatus>;
  // ✅ 新增 'great' 到聯合型別中
  overallStatus: 'normal' | 'follow_up' | 'referral' | 'great'; 
  totalScore: number; 
}