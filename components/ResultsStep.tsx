"use client";

import { AssessmentResult, MATURITY_LEVELS } from "@/types/assessment";
import { BarChart3, Target, TrendingUp, CheckCircle } from "@/components/icons";
import AIRecommendations from "@/components/AIRecommendations";

interface ResultsStepProps {
  result: AssessmentResult;
  onRestart: () => void;
}

export default function ResultsStep({ result, onRestart }: ResultsStepProps) {
  const levelInfo = MATURITY_LEVELS.find(
    (l) => l.name === result.calculated_level
  );
  const selfLevelInfo = MATURITY_LEVELS.find(
    (l) => l.name === result.self_assessment
  );

  const progressPercentage = (result.score / 75) * 100;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
          Ihre AI-Maturity Auswertung
        </h2>
        <p className="text-secondary-600 text-lg">
          Hier sind Ihre Ergebnisse und Empfehlungen für den nächsten Schritt
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Company Info */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            📋 Unternehmensprofil
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-secondary-600">Branche:</span>
              <div className="font-medium text-secondary-900">
                {result.company_info.industry}
              </div>
            </div>
            <div>
              <span className="text-sm text-secondary-600">
                Unternehmensgröße:
              </span>
              <div className="font-medium text-secondary-900">
                {result.company_info.companySize}
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            🏢 Ihr Unternehmensprofil
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-secondary-600">Branche:</span>
              <div className="font-medium text-secondary-900">
                {result.company_info.industry}
              </div>
            </div>
            <div>
              <span className="text-sm text-secondary-600">
                Unternehmensgröße:
              </span>
              <div className="font-medium text-secondary-900">
                {result.company_info.companySize}
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-secondary-900 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-primary-600" />
              Ihr AI-Maturity Score
            </h3>
            <div className="text-3xl font-bold text-primary-600">
              {result.score}/75
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-secondary-600 mb-2">
              <span>AI-Maturity Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  levelInfo?.color || "bg-primary-600"
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-500" />
              Ihre Selbsteinschätzung
            </h3>
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full ${selfLevelInfo?.color} flex items-center justify-center text-white text-lg`}
              >
                {selfLevelInfo?.icon}
              </div>
              <div>
                <div className="font-medium text-secondary-900">
                  {result.self_assessment}
                </div>
                <div className="text-sm text-secondary-600">
                  {selfLevelInfo?.description}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Berechneter Reifegrad
            </h3>
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full ${levelInfo?.color} flex items-center justify-center text-white text-lg`}
              >
                {levelInfo?.icon}
              </div>
              <div>
                <div className="font-medium text-secondary-900">
                  {result.calculated_level}
                </div>
                <div className="text-sm text-secondary-600">
                  {result.level_description}
                </div>
              </div>
            </div>

            {result.delta !== "0" && (
              <div
                className={`mt-3 p-2 rounded-lg text-sm ${
                  result.delta.startsWith("+")
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                Abweichung: {result.delta} Stufe
                {Math.abs(parseInt(result.delta)) > 1 ? "n" : ""}
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Insights zu Ihrer Einschätzung
          </h3>
          <p className="text-secondary-700 leading-relaxed">{result.insight}</p>
        </div>

        {/* Detailed AI Recommendations */}
        {/* AI-Powered Recommendations */}
        <AIRecommendations result={result} />

        {/* Original Next Steps for Reference */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            🎯 Basis-Empfehlungen
          </h3>
          <p className="text-secondary-700 leading-relaxed">
            {result.next_steps}
          </p>
        </div>

        {/* Level Characteristics */}
        {levelInfo && (
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Charakteristika Ihrer AI-Maturity-Stufe
            </h3>
            <ul className="space-y-2">
              {levelInfo.characteristics.map((characteristic, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-secondary-700">{characteristic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button onClick={onRestart} className="btn btn-primary px-8 py-3">
            Neues Assessment starten
          </button>

          <div className="text-sm text-secondary-600">
            Möchten Sie Ihre Ergebnisse mit Ihrem Team teilen oder einen
            Beratungstermin vereinbaren?
          </div>
        </div>
      </div>
    </div>
  );
}
