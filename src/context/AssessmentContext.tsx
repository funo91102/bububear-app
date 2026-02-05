import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// 導入專案型別
import type { 
  Screen, 
  ChildProfile, 
  Answers, 
  StandardAnswerStatus, // ✅ 修正：使用 types/index.ts 定義的名稱
  Feedback, 
  AssessmentResult 
} from '../types';

interface AssessmentContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;
  
  answers: Answers;
  // 統一命名為 setAnswer (參數型別同步為 StandardAnswerStatus)
  setAnswer: (questionId: string, status: StandardAnswerStatus) => void;
  // 保留 updateAnswer 作為別名，相容舊程式碼
  updateAnswer: (questionId: string, status: StandardAnswerStatus) => void;

  feedback: Feedback | null;
  setFeedback: (feedback: Feedback) => void;

  // 評估結果狀態
  assessmentResult: AssessmentResult | null;
  setAssessmentResult: (result: AssessmentResult) => void;

  // 當前題號索引
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;

  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // 核心函式：儲存答案
  // 這裡的 status 使用 StandardAnswerStatus
  const setAnswer = (questionId: string, status: StandardAnswerStatus) => {
    setAnswers(prev => ({ ...prev, [questionId]: status }));
  };

  const resetAssessment = () => {
    setScreen('welcome');
    setChildProfile(null);
    setAnswers({});
    setFeedback(null);
    setAssessmentResult(null);
    setCurrentQuestionIndex(0);
  };

  return (
    <AssessmentContext.Provider value={{ 
      screen, 
      setScreen, 
      childProfile, 
      setChildProfile, 
      answers, 
      setAnswer,
      updateAnswer: setAnswer, 
      feedback,
      setFeedback,
      assessmentResult,
      setAssessmentResult,
      currentQuestionIndex,
      setCurrentQuestionIndex,
      resetAssessment 
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error('useAssessment must be used within an AssessmentProvider');
  return context;
};