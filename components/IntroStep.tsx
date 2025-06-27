"use client";

import { Brain, Target, BarChart3, TrendingUp, CheckCircle } from "@/components/icons";

interface IntroStepProps {
  onNext: () => void;
}

export default function IntroStep({ onNext }: IntroStepProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 rounded-full p-4">
                <Brain className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              NETNODE AI Maturity Check
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Entdecken Sie den aktuellen KI-Reifegrad Ihres Unternehmens und erhalten Sie personalisierte Empfehlungen für Ihre digitale Transformation.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-10">
          {/* Why Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Warum ist der AI Maturity Check wichtig?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Standortbestimmung</h3>
                <p className="text-gray-600 text-sm">
                  Erfahren Sie, wo Ihr Unternehmen aktuell bei der KI-Implementierung steht und welche Potenziale noch ungenutzt sind.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-secondary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Benchmarking</h3>
                <p className="text-gray-600 text-sm">
                  Vergleichen Sie sich mit anderen Unternehmen Ihrer Branche und identifizieren Sie Best Practices.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Strategische Richtung</h3>
                <p className="text-gray-600 text-sm">
                  Entwickeln Sie eine klare KI-Strategie basierend auf datengestützten Erkenntnissen und Empfehlungen.
                </p>
              </div>
            </div>
          </div>

          {/* What you get Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Was Sie am Ende erhalten:
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Persönlicher AI-Reifegrad</h4>
                      <p className="text-gray-600 text-sm">
                        Eine detaillierte Einschätzung Ihres aktuellen KI-Maturity-Levels mit spezifischen Charakteristika.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Maßgeschneiderte Empfehlungen</h4>
                      <p className="text-gray-600 text-sm">
                        KI-generierte, actionable Empfehlungen für Ihre nächsten Schritte in der digitalen Transformation.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Konkrete Use Cases</h4>
                      <p className="text-gray-600 text-sm">
                        Die zwei vielversprechendsten KI-Anwendungsfälle, speziell für Ihre Branche und Unternehmensgröße.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Branchenspezifische Insights</h4>
                      <p className="text-gray-600 text-sm">
                        Erkenntnisse und Vergleiche mit anderen Unternehmen in Ihrer Branche und Größenklasse.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Info */}
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900">Der Check dauert nur 5-7 Minuten</h3>
              </div>
              <p className="text-blue-800 text-sm">
                Beantworten Sie kurz Fragen zu Ihrem Unternehmensprofil, schätzen Sie sich selbst ein und durchlaufen Sie unser wissenschaftlich fundiertes Assessment. Ihre Daten werden vertraulich behandelt.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={onNext}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              AI Maturity Check starten
            </button>
            <p className="text-gray-500 text-sm mt-3">
              Kostenlos • Keine Anmeldung erforderlich • Sofortige Ergebnisse
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
