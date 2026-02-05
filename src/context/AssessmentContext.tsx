import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  AssessmentContextType, 
  ChildProfile, 
  Answers, 
  RawAnswerValue, 
  ParentFeedback,
  AssessmentResult,
  AgeGroupKey
} from '../types';
import { calculateAssessmentResult } from '../utils/screeningEngine';

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<AssessmentContextType['screen']>('welcome');
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [feedback, setFeedback] = useState<ParentFeedback | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  // ✅ 優化 3: 避免隱性覆蓋與不必要的 Re-render
  // 只有當值真的改變時，才觸發狀態更新
  const setAnswer = (questionId: string, value: RawAnswerValue) => {
    setAnswers(prev => {
      // 若新舊值相同 (Strict Equality)，直接回傳舊物件參照，React 將會跳過 Render
      if (prev[questionId] === value) return prev;
      
      return {
        ...prev,
        [questionId]: value
      };
    });
  };

  // ✅ 優化 1 & 2: 醫療級防呆與中繼資料鎖定
  const calculateResult = (ageGroupKey: AgeGroupKey) => {
    // 1. 防呆檢查
    if (!ageGroupKey) {
      console.error('System Error: calculateResult called without ageGroupKey');
      return;
    }

    const answerCount = Object.keys(answers).length;
    if (answerCount === 0) {
      console.warn('Warning: calculateResult called with empty answers. This might be a premature calculation.');
      // 依需求決定是否阻擋，這裡先給予警告，但允許計算 (可能真的全都没填)
    }

    console.log(`開始計算 ${ageGroupKey} 的評估結果...`);
    
    // 2. 核心計算
    const result = calculateAssessmentResult(ageGroupKey, answers);
    
    // 3. 注入 Metadata (版本鎖定)
    const resultWithMeta: AssessmentResult = {
      ...result,
      meta: {
        calculatedAt: new Date().toISOString(), // 鎖定計算時間
        ageGroupKey: ageGroupKey,               // 鎖定使用的量表版本
        answerCount: answerCount                // 記錄當時的答題數量
      }
    };

    setAssessmentResult(resultWithMeta);
  };

  const resetAssessment = () => {
    setScreen('welcome');
    setChildProfile(null);
    setAnswers({});
    setFeedback(null);
    setAssessmentResult(null);
  };

  return (
    <AssessmentContext.Provider value={{
      screen,
      setScreen,
      childProfile,
      setChildProfile,
      answers,
      setAnswer,
      feedback,
      setFeedback,
      assessmentResult,
      calculateResult,
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