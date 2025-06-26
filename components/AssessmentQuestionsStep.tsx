'use client';

import { ASSESSMENT_QUESTIONS, AssessmentAnswer } from '@/types/assessment';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons';

interface AssessmentQuestionsStepProps {
  onNext: (answers: AssessmentAnswer[]) => void;
  onBack: () => void;
}

export default function AssessmentQuestionsStep({ onNext, onBack }: AssessmentQuestionsStepProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);

  const handleAnswerChange = (score: number) => {
    const questionId = ASSESSMENT_QUESTIONS[currentQuestion].id;
    const newAnswers = answers.filter(a => a.questionId !== questionId);
    newAnswers.push({ questionId, score });
    setAnswers(newAnswers);

    // Automatisch zur nächsten Frage oder zum Ergebnis
    setTimeout(() => {
      if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Alle Fragen beantwortet - zur Auswertung
        const finalAnswers = [...newAnswers];
        onNext(finalAnswers);
      }
    }, 300); // Kurze Verzögerung für visuelles Feedback
  };

  const getCurrentAnswer = () => {
    const questionId = ASSESSMENT_QUESTIONS[currentQuestion].id;
    return answers.find(a => a.questionId === questionId)?.score || null;
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onBack();
    }
  };

  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  const question = ASSESSMENT_QUESTIONS[currentQuestion];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
          Assessment-Fragen
        </h2>
        <p className="text-secondary-600 text-lg">
          Bewerten Sie die folgenden Aussagen auf einer Skala von 1 bis 5
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-between text-sm text-secondary-600 mb-2">
          <span>Frage {currentQuestion + 1} von {ASSESSMENT_QUESTIONS.length}</span>
          <span>{Math.round(progress)}% abgeschlossen</span>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-3xl mx-auto">
        <div className="card animate-slide-up">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">
              {question.statement}
            </h3>
            <p className="text-sm text-secondary-500">
              Kategorie: {question.level}
            </p>
          </div>

          {/* Rating Scale */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-secondary-600 mb-2">
              <span>Trifft gar nicht zu</span>
              <span>Trifft voll zu</span>
            </div>
            
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleAnswerChange(score)}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center font-semibold hover:scale-110 active:scale-95 ${
                    getCurrentAnswer() === score
                      ? 'border-primary-500 bg-primary-500 text-white shadow-lg'
                      : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50 hover:shadow-md'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-secondary-500 px-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Zurück</span>
          </button>

          <div className="text-center">
            <span className="text-sm text-secondary-600">
              {answers.length} von {ASSESSMENT_QUESTIONS.length} beantwortet
            </span>
            <div className="text-xs text-secondary-500 mt-1">
              Wählen Sie eine Bewertung - die nächste Frage erscheint automatisch
            </div>
          </div>

          {/* Platzhalter für symmetrisches Layout */}
          <div className="w-24"></div>
        </div>
      </div>
    </div>
  );
}
