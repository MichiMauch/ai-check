'use client';

import { MaturityLevel, MATURITY_LEVELS } from '@/types/assessment';
import { useState } from 'react';

interface SelfAssessmentStepProps {
  onNext: (selectedLevel: MaturityLevel) => void;
}

export default function SelfAssessmentStep({ onNext }: SelfAssessmentStepProps) {
  const [selectedLevel, setSelectedLevel] = useState<MaturityLevel | null>(null);

  const handleNext = () => {
    if (selectedLevel) {
      onNext(selectedLevel);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
          Selbsteinschätzung
        </h2>
        <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
          Wählen Sie spontan die AI-Maturity-Stufe, die Ihr Unternehmen am besten beschreibt.
        </p>
      </div>

      <div className="grid gap-4 max-w-4xl mx-auto">
        {MATURITY_LEVELS.map((level, index) => (
          <div
            key={level.name}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedLevel === level.name
                ? 'ring-2 ring-primary-500 border-primary-300'
                : 'hover:border-primary-200'
            }`}
            onClick={() => setSelectedLevel(level.name)}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full ${level.color} flex items-center justify-center text-white text-xl font-bold`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                  {level.name}
                </h3>
                <p className="text-secondary-600 text-sm">
                  {level.description}
                </p>
              </div>
              <div className="text-2xl">
                {level.icon}
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedLevel === level.name
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-secondary-300'
              }`}>
                {selectedLevel === level.name && (
                  <div className="w-full h-full rounded-full bg-white border border-primary-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleNext}
          disabled={!selectedLevel}
          className={`btn btn-primary px-8 py-3 text-lg ${
            !selectedLevel ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Weiter zum Assessment
        </button>
      </div>
    </div>
  );
}
