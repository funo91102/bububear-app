import React, { createContext, useContext, useState, ReactNode } from 'react';

// ▼ 1. 補上 AssessmentResult 型別導入
import type { 
  Screen, 
  ChildProfile, 
  Answers, 
  AnswerStatus, 
  Feedback, 
  AssessmentResult 
} from '../types';

interface AssessmentContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;
  
  answers: Answers;
  // ▼ 2. 統一命名為 setAnswer (符合 AssessmentScreen 的呼叫)
  setAnswer: (questionId: string, status: AnswerStatus) => void;
  // (選用) 保留 updateAnswer 作為別名，相容舊程式碼
  updateAnswer: (questionId: string, status: AnswerStatus) => void;

  feedback: Feedback | null;
  setFeedback: (feedback: Feedback) => void;

  // ▼ 3. 新增：評估結果的狀態與更新函式 (解決結果頁跳回問題)
  assessmentResult: AssessmentResult | null;
  setAssessmentResult: (result: AssessmentResult) => void;

  // 新增：當前題號索引 (選用，若希望跨頁面保留進度)
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number | ((prev: number) => number)) => void;

  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  
  // ▼ 新增結果狀態
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  
  // ▼ 新增題號狀態 (讓 AssessmentScreen 可以讀寫)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // 核心函式：儲存答案
  const setAnswer = (questionId: string, status: AnswerStatus) => {
    setAnswers(prev => ({ ...prev, [questionId]: status }));
  };

  const resetAssessment = () => {
    setScreen('welcome');
    setChildProfile(null);
    setAnswers({});
    setFeedback(null);
    setAssessmentResult(null); // 重置結果
    setCurrentQuestionIndex(0); // 重置題號
  };

  return (
    <AssessmentContext.Provider value={{ 
      screen, 
      setScreen, 
      childProfile, 
      setChildProfile, 
      answers, 
      setAnswer,           // ✅ 主要使用這個
      updateAnswer: setAnswer, // ✅ 相容舊名
      feedback,
      setFeedback,
      assessmentResult,    // ✅ 讓 FeedbackScreen 可以存結果
      setAssessmentResult, // ✅ 讓 ResultsScreen 可以讀結果
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