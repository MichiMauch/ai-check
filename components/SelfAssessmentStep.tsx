"use client";

import { MaturityLevel, MATURITY_LEVELS } from "@/types/assessment";
import { useState } from "react";
import MaturityLevelVisualization from "./MaturityLevelVisualization";

interface SelfAssessmentStepProps {
  onNext: (selectedLevel: MaturityLevel) => void;
  onBack?: () => void;
}

export default function SelfAssessmentStep({
  onNext,
  onBack,
}: SelfAssessmentStepProps) {
  const [selectedLevel, setSelectedLevel] = useState<MaturityLevel | null>(
    null
  );

  const handleNext = () => {
    if (selectedLevel) {
      onNext(selectedLevel);
    }
  };

  const handleLevelSelect = (level: MaturityLevel) => {
    setSelectedLevel(level);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
          Selbsteinschätzung
        </h2>
        <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
          Wählen Sie spontan die AI-Maturity-Stufe, die Ihr Unternehmen am
          besten beschreibt.
        </p>
      </div>

      {/* Interactive Maturity Level Visualization */}
      <div className="max-w-6xl mx-auto mb-8">
        <MaturityLevelVisualization
          selectedLevel={selectedLevel || undefined}
          onLevelSelect={handleLevelSelect}
          showSelection={true}
          className="mb-6"
        />
      </div>

      <div className="flex justify-between items-center mt-8">
        {onBack ? (
          <button onClick={onBack} className="btn btn-secondary px-6 py-2">
            Zurück
          </button>
        ) : (
          <div></div>
        )}

        <button
          onClick={handleNext}
          disabled={!selectedLevel}
          className={`btn btn-primary px-8 py-3 text-lg ${
            !selectedLevel ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Weiter zum Assessment
        </button>

        <div></div>
      </div>
    </div>
  );
}
