"use client";

import { useState } from "react";
import {
  MaturityLevel,
  AssessmentAnswer,
  AssessmentResult,
  CompanyInfo,
} from "@/types/assessment";
import { AssessmentCalculator } from "@/lib/assessment-calculator";
import CompanyInfoStep from "@/components/CompanyInfoStep";
import SelfAssessmentStep from "@/components/SelfAssessmentStep";
import AssessmentQuestionsStep from "@/components/AssessmentQuestionsStep";
import ResultsStep from "@/components/ResultsStep";
import IntroStep from "@/components/IntroStep";
import { Brain } from "@/components/icons";

type Step = "intro" | "company-info" | "self-assessment" | "questions" | "results";

export default function AssessmentTool() {
  const [currentStep, setCurrentStep] = useState<Step>("intro");
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [selfAssessment, setSelfAssessment] = useState<MaturityLevel | null>(
    null
  );
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  const handleIntroNext = () => {
    setCurrentStep("company-info");
  };

  const handleCompanyInfoNext = (info: CompanyInfo) => {
    setCompanyInfo(info);
    setCurrentStep("self-assessment");
  };

  const handleSelfAssessmentNext = (selectedLevel: MaturityLevel) => {
    setSelfAssessment(selectedLevel);
    setCurrentStep("questions");
  };

  const handleQuestionsNext = async (answers: AssessmentAnswer[]) => {
    if (selfAssessment && companyInfo) {
      const result = AssessmentCalculator.calculateResult(
        selfAssessment,
        answers,
        companyInfo
      );
      setAssessmentResult(result);

      // Assessment in Datenbank speichern
      try {
        const completionTimeMs = Date.now() - startTime;
        const answerScores = answers.map(a => a.score);

        const response = await fetch('/api/assessments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            result,
            answers: answerScores,
            completionTimeMs,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAssessmentId(data.assessmentId);
          console.log('Assessment gespeichert:', data.assessmentId);
        } else {
          console.warn('Assessment konnte nicht gespeichert werden');
        }
      } catch (error) {
        console.warn('Fehler beim Speichern des Assessments:', error);
        // Fortfahren ohne Datenbankfehler zu zeigen
      }

      setCurrentStep("results");
    }
  };

  const handleQuestionsBack = () => {
    setCurrentStep("self-assessment");
  };

  const handleSelfAssessmentBack = () => {
    setCurrentStep("company-info");
  };

  const handleCompanyInfoBack = () => {
    setCurrentStep("intro");
  };

  const handleRestart = () => {
    setCompanyInfo(null);
    setSelfAssessment(null);
    setAssessmentResult(null);
    setCurrentStep("intro");
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "intro":
        return 0;
      case "company-info":
        return 1;
      case "self-assessment":
        return 2;
      case "questions":
        return 3;
      case "results":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header - nur anzeigen wenn nicht auf intro */}
      {currentStep !== "intro" && (
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center space-x-3">
              <Brain className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-secondary-900">
                AI Maturity Checker
              </h1>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= getStepNumber()
                          ? "bg-primary-600 text-white"
                          : "bg-secondary-200 text-secondary-600"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${
                          step < getStepNumber()
                            ? "bg-primary-600"
                            : "bg-secondary-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-2">
              <div className="flex space-x-8 text-xs text-secondary-600">
                <span
                  className={
                    getStepNumber() >= 1 ? "text-primary-600 font-medium" : ""
                  }
                >
                  Firmenprofil
                </span>
                <span
                  className={
                    getStepNumber() >= 2 ? "text-primary-600 font-medium" : ""
                  }
                >
                  Selbsteinschätzung
                </span>
                <span
                  className={
                    getStepNumber() >= 3 ? "text-primary-600 font-medium" : ""
                  }
                >
                  Assessment
                </span>
                <span
                  className={
                    getStepNumber() >= 4 ? "text-primary-600 font-medium" : ""
                  }
                >
                  Ergebnisse
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentStep === "intro" && (
          <IntroStep onNext={handleIntroNext} />
        )}

        {currentStep === "company-info" && (
          <CompanyInfoStep onNext={handleCompanyInfoNext} onBack={handleCompanyInfoBack} />
        )}

        {currentStep === "self-assessment" && (
          <SelfAssessmentStep
            onNext={handleSelfAssessmentNext}
            onBack={handleSelfAssessmentBack}
          />
        )}

        {currentStep === "questions" && (
          <AssessmentQuestionsStep
            onNext={handleQuestionsNext}
            onBack={handleQuestionsBack}
          />
        )}

        {currentStep === "results" && assessmentResult && (
          <ResultsStep result={assessmentResult} onRestart={handleRestart} />
        )}
      </main>

      {/* Footer - nur anzeigen wenn nicht auf intro */}
      {currentStep !== "intro" && (
        <footer className="bg-white border-t border-secondary-200 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-secondary-600 text-sm">
            <p>
              © 2025 AI Maturity Checker - Entwickelt für digitale Transformation
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
