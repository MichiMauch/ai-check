'use client';

import { useState, useEffect } from 'react';
import type { UseCaseRecommendation } from '@/types/use-case';
import type { AssessmentResult } from '@/types/assessment';

interface UseCaseRecommendationsProps {
  assessmentResult: AssessmentResult;
}

export default function UseCaseRecommendations({ assessmentResult }: UseCaseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<UseCaseRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 65 Sekunden Timeout für den Fetch (länger als Vercel Function)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 65000);
        
        const response = await fetch('/api/use-case-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(assessmentResult),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 408 || errorData.errorType === 'timeout') {
            throw new Error('Die AI-Generierung dauert länger als erwartet. Bitte versuchen Sie es erneut.');
          }
          throw new Error(errorData.error || 'Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data.recommendations);
        
        // Debug: Processing time anzeigen
        if (data.meta?.processingTimeMs) {
          console.log(`Use cases generated in ${data.meta.processingTimeMs}ms`);
        }
        
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Die AI-Generierung wurde aufgrund eines Timeouts abgebrochen. Bitte versuchen Sie es erneut.');
        } else {
          setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [assessmentResult]);

  const refetchRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/use-case-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentResult),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      automation: '🤖',
      analytics: '📊',
      'customer-experience': '👥',
      operations: '⚙️',
      innovation: '💡',
    };
    return icons[category as keyof typeof icons] || '🔧';
  };

  const getComplexityColor = (complexity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[complexity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🤖 AI generiert Ihre persönlichen Use Cases...
          </h3>
          <p className="text-gray-600 mb-4">
            Unsere KI analysiert Ihr Assessment und erstellt branchenspezifische, 
            auf Ihr Unternehmen zugeschnittene AI-Anwendungsfälle.
          </p>
          <div className="text-sm text-gray-500">
            Dies kann einige Sekunden dauern...
          </div>
        </div>
        <div className="mt-8 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 bg-gray-50">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            AI-Generierung fehlgeschlagen
          </h3>
          <p className="text-gray-600 mb-4">
            Die AI-gestützte Generierung Ihrer Use Cases ist fehlgeschlagen. 
            Dies kann bei hoher Serverlast oder temporären API-Problemen auftreten.
          </p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={refetchRecommendations}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 AI-Generierung erneut starten
          </button>
          <div className="mt-4 text-xs text-gray-400">
            Bei wiederholten Problemen wird automatisch ein Fallback-Use Case bereitgestellt
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Ihre AI-gestützten Use Case Empfehlungen
        </h2>
        <p className="text-gray-600">
          Unsere KI hat basierend auf Ihrem Assessment {recommendations.length} maßgeschneiderte AI-Anwendungsfälle 
          für Ihr Unternehmen in der {assessmentResult.company_info.industry === 'automotive' ? 'Automotive-Branche' : 
          assessmentResult.company_info.industry === 'banking-finance' ? 'Banking & Finance-Branche' : 
          assessmentResult.company_info.industry + '-Branche'} generiert:
        </p>
        <div className="mt-2 flex items-center text-sm text-blue-600">
          <span className="mr-2">🤖</span>
          <span>Dynamisch generiert mit OpenAI • Maturity Level: {assessmentResult.calculated_level}</span>
        </div>
      </div>

      <div className="space-y-6">
        {recommendations.map((recommendation, index) => (
          <div key={recommendation.useCase.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(recommendation.useCase.category)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {recommendation.useCase.title}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {recommendation.useCase.category.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(recommendation.useCase.complexity)}`}>
                    {recommendation.useCase.complexity === 'low' ? 'Einfach' : 
                     recommendation.useCase.complexity === 'medium' ? 'Mittel' : 'Komplex'}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      Machbarkeit: {recommendation.feasibilityScore}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Priorität: {recommendation.priorityScore}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">{recommendation.useCase.description}</p>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Warum dieser Use Case für Sie geeignet ist:</h4>
                <p className="text-blue-700 text-sm">{recommendation.reasoning}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">💰 Investition</h4>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(recommendation.useCase.estimatedCost.min)} - {formatCurrency(recommendation.useCase.estimatedCost.max)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Implementierungszeit: {recommendation.useCase.timeToImplement}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">📈 ROI</h4>
                  <p className="text-sm text-green-700">
                    {recommendation.useCase.estimatedROI.percentage}% in {recommendation.useCase.estimatedROI.timeframe}
                  </p>
                  <p className="text-xs text-green-600 mt-1">{recommendation.useCase.estimatedROI.description}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">🎯 Erfolgsfaktoren</h4>
                  <p className="text-sm text-purple-700">
                    Benötigt: {recommendation.useCase.requiredMaturityLevel === 'beginner' ? 'Grundlagen' :
                             recommendation.useCase.requiredMaturityLevel === 'intermediate' ? 'Fortgeschritten' :
                             recommendation.useCase.requiredMaturityLevel === 'advanced' ? 'Experte' : 'Sehr erfahren'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">✅ Vorteile</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {recommendation.useCase.benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">⚠️ Voraussetzungen</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {recommendation.useCase.prerequisites.slice(0, 3).map((prereq, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-yellow-500 mr-2">•</span>
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">🚀 Empfohlene nächste Schritte</h4>
                <ol className="text-sm text-gray-600 space-y-1">
                  {recommendation.adaptedSteps.slice(0, 4).map((step, i) => (
                    <li key={i} className="flex items-start">
                      <span className="font-medium text-blue-600 mr-2">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">Technologien:</span>
                  {recommendation.useCase.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tipp für die Umsetzung</h3>
        <p className="text-blue-700 text-sm">
          Starten Sie mit dem Use Case mit der höchsten Machbarkeit und beginnen Sie mit einem kleinen Pilotprojekt. 
          So sammeln Sie erste Erfahrungen und können schrittweise komplexere AI-Projekte angehen.
        </p>
      </div>
    </div>
  );
}
