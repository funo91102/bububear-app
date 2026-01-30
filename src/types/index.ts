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
   emoji?: string;
   flashcard?: string | string[]; 
   flashcardOptions?: FlashcardOption[];
   flashcardImageSrc?: string; 
 }
 
 /**
  * 4. 發展領域與年齡分組
  */
 // ▼▼▼ 關鍵點：請檢查您的檔案中是否有這一行 export type ▼▼▼
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
 export type AnswerStatus = 'pass' | 'fail' | 'refused' | 'unanswered';
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