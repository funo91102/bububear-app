import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// 導入專案型別
import type { 
  Screen, 
  ChildProfile, 
  Answers, 
  StandardAnswerStatus,
  Feedback, 
  AssessmentResult 
} from '../types';

interface AssessmentContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;
  
  answers: Answers;
  setAnswer: (questionId: string, status: StandardAnswerStatus) => void;
  updateAnswer: (questionId: string, status: StandardAnswerStatus) => void;

  feedback: Feedback | null;
  setFeedback: (feedback: Feedback) => void;

  assessmentResult: AssessmentResult | null;
  setAssessmentResult: (result: AssessmentResult) => void;

  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;

  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreenState] = useState<Screen>('welcome');
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [feedback, setFeedbackState] = useState<Feedback | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // 🔧 包裝 setScreen，加入 debug 和強制更新
  const setScreen = (newScreen: Screen) => {
    console.log(`🔄 [Context] setScreen 被呼叫: ${screen} → ${newScreen}`);
    setScreenState(newScreen);
    console.log(`✅ [Context] setScreen 狀態已更新為: ${newScreen}`);
  };

  // 🔧 包裝 setFeedback，加入 debug 和錯誤處理
  const setFeedback = (feedbackData: Feedback) => {
    try {
      console.log('📝 [Context] setFeedback 被呼叫:', feedbackData);
      setFeedbackState(feedbackData);
      console.log('✅ [Context] setFeedback 狀態已更新');
    } catch (error) {
      console.error('❌ [Context] setFeedback 失敗:', error);
      // 不拋出錯誤，允許繼續執行
    }
  };

  const setAnswer = (questionId: string, status: StandardAnswerStatus) => {
    setAnswers(prev => ({ ...prev, [questionId]: status }));
  };

  const resetAssessment = () => {
    setScreen('welcome');
    setChildProfile(null);
    setAnswers({});
    setFeedbackState(null);
    setAssessmentResult(null);
    setCurrentQuestionIndex(0);
  };

  // 🔧 加入 debug：監控 screen 變化
  React.useEffect(() => {
    console.log(`🎬 [Context] screen 狀態變更: ${screen}`);
  }, [screen]);

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
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

// 🔧 加入 default export
export default useAssessment;