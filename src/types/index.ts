// src/types/index.ts

export type DomainKey = 'gross_motor' | 'fine_motor' | 'cognitive_language' | 'social';

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

export type QuestionType = 'observation' | 'interaction' | 'question';
export type RawAnswerValue = boolean | number | string | 'pass' | 'fail' | 'max' | 'doctor_assessment';
export type StandardAnswerStatus = 'pass' | 'fail';

// ✅ 修正重點：加上 export 關鍵字
export interface FlashcardOption {
  label: string;
  imageSrc: string;
  bgColor?: string;
}

export interface Question {
  id: string;
  text: string;           
  description?: string;   
  type: '實' | '問' | '實/問'; 
  category?: string;      
  hpaCategory?: string;   
  weight?: number;        
  emoji?: string;         
  kind?: 'emoji' | 'image' | 'multi_image'; 
  imageSrc?: string;      
  
  flashcardOptions?: FlashcardOption[];

  warning?: string;       
  allowDoctorAssessment?: boolean; 
}

export interface Domain {
  name: string;
  key: DomainKey;
  cutoff: number;         
  questions: Question[];
}

export type AgeGroupData = Record<DomainKey, Domain>;
export type ScreeningData = Record<AgeGroupKey, AgeGroupData>;
export type Answers = Record<string, RawAnswerValue>;
export type AssessmentStatus = 'pass' | 'fail' | 'max'; 

export interface AssessmentResult {
  domainScores: Record<DomainKey, number>;
  domainStatuses: Record<DomainKey, AssessmentStatus>;
  overallStatus: 'great' | 'normal' | 'referral'; 
  totalScore: number;
  
  meta?: {
    calculatedAt: string;
    ageGroupKey: AgeGroupKey;
    answerCount: number;
  };
}

export interface ChildProfile {
  nickname: string;
  birthDate: string;      
  gestationalAge: number; 
}

export interface ParentFeedback {
  anxietyScore: number;   
  notes: string;
}

export interface AssessmentContextType {
  screen: 'welcome' | 'confirmation' | 'tool_prep' | 'assessment' | 'feedback' | 'results';
  setScreen: (screen: 'welcome' | 'confirmation' | 'tool_prep' | 'assessment' | 'feedback' | 'results') => void;
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;
  answers: Answers;
  setAnswer: (questionId: string, value: RawAnswerValue) => void;
  feedback: ParentFeedback | null;
  setFeedback: (feedback: ParentFeedback) => void;
  assessmentResult: AssessmentResult | null;
  calculateResult: (ageGroup: AgeGroupKey) => void;
  resetAssessment: () => void;
}