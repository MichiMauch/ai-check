"use client";

import { AssessmentResult, MATURITY_LEVELS, AI_PRODUCTS, AIProduct } from "@/types/assessment";
import { TrendingUp, CheckCircle } from "@/components/icons";
import AIRecommendations from "@/components/AIRecommendations";
import MaturityLevelVisualization from "@/components/MaturityLevelVisualization";

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

  // Filter passende Produkte basierend auf Assessment
  const getRecommendedProducts = (): AIProduct[] => {
    return AI_PRODUCTS.filter((product) => {
      const matchesMaturity = product.targetMaturityLevels.includes(
        result.calculated_level
      );
      const matchesIndustry = product.targetIndustries.includes(
        result.company_info.industry
      );
      const matchesSize = product.targetCompanySizes.includes(
        result.company_info.companySize
      );

      // Mindestens 2 von 3 Kriterien müssen erfüllt sein
      const matchCount = [matchesMaturity, matchesIndustry, matchesSize].filter(
        Boolean
      ).length;
      return matchCount >= 2;
    });
  };

  const recommendedProducts = getRecommendedProducts();

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

      <div className="max-w-6xl mx-auto space-y-6">
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
                Unternehmensgrösse:
              </span>
              <div className="font-medium text-secondary-900">
                {result.company_info.companySize}
              </div>
            </div>
          </div>
        </div>

        {/* AI Maturity Level Visualization */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">
            📊 Ihr AI-Reifegrad im Überblick
          </h3>
          
          {/* Progress Bar direkt unter dem Titel */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-secondary-600 mb-2">
              <span>AI-Maturity Progress</span>
              <span className="font-medium text-primary-600">{result.score}/75 Punkte ({Math.round(progressPercentage)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-primary-500 to-primary-600"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <MaturityLevelVisualization
            calculatedLevel={result.calculated_level}
            selfAssessment={result.self_assessment}
            showSelection={false}
            className="mb-4"
          />
          
          {/* Insights direkt unter der Visualisierung */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-secondary-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-secondary-900 text-sm mb-1">Insights zu Ihrer Einschätzung</h5>
                <p className="text-secondary-700 text-sm leading-relaxed">{result.insight}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        {recommendedProducts.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              🎯 Empfohlene Lösungen für Sie
            </h3>

            <div className="space-y-4">
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-secondary-900">
                        {product.name}
                      </h4>
                      <p className="text-sm text-primary-600 font-medium">
                        {product.subtitle}
                      </p>
                    </div>
                    <div className="text-right text-sm text-secondary-600">
                      <div className="font-medium">{product.pricing}</div>
                      <div>{product.timeline}</div>
                    </div>
                  </div>

                  <p className="text-secondary-700 text-sm mb-3 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {product.targetMaturityLevels.includes(
                        result.calculated_level
                      ) && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          ✓ Passt zu Ihrem Reifegrad
                        </span>
                      )}
                      {product.targetIndustries.includes(
                        result.company_info.industry
                      ) && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          ✓ Branchenspezifisch
                        </span>
                      )}
                      {product.targetCompanySizes.includes(
                        result.company_info.companySize
                      ) && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          ✓ Passende Grösse
                        </span>
                      )}
                    </div>

                    <button className="btn btn-primary btn-sm">
                      Mehr erfahren
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
