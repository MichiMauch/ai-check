'use client';

import { useState, useEffect } from 'react';
import { AssessmentResult, AI_PRODUCTS, AIProduct } from '@/types/assessment';

interface AIRecommendationsProps {
  result: AssessmentResult;
}

export default function AIRecommendations({ result }: AIRecommendationsProps) {
  const [recommendation, setRecommendation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter passende Produkte basierend auf Assessment
  const getRecommendedProducts = (): AIProduct[] => {
    return AI_PRODUCTS.filter(product => {
      const matchesMaturity = product.targetMaturityLevels.includes(result.calculated_level);
      const matchesIndustry = product.targetIndustries.includes(result.company_info.industry);
      const matchesSize = product.targetCompanySizes.includes(result.company_info.companySize);
      
      // Mindestens 2 von 3 Kriterien müssen erfüllt sein
      const matchCount = [matchesMaturity, matchesIndustry, matchesSize].filter(Boolean).length;
      return matchCount >= 2;
    });
  };

  const recommendedProducts = getRecommendedProducts();

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ai-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ result }),
        });

        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        }
        
        setRecommendation(data.recommendation);
      } catch (err) {
        setError('Fehler beim Laden der AI-Empfehlungen');
        console.error('Error fetching AI recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [result]);

  return (
    <div className="space-y-6">
      {/* AI-Generated Detailed Recommendations */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
            🤖 AI-Powered Empfehlungen
          </h3>
          {error && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Fallback-Modus
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="flex items-center space-x-3 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-secondary-600">Generiere personalisierte Empfehlungen...</span>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-secondary-700">
            {recommendation.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return null;
              
              // Handle markdown-style formatting
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h4 key={index} className="font-semibold text-secondary-900 mt-4 mb-2">
                    {paragraph.slice(2, -2)}
                  </h4>
                );
              }
              
              return (
                <p key={index} className="mb-3 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Recommendations */}
      {recommendedProducts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            🎯 Empfohlene Lösungen für Sie
          </h3>
          
          <div className="space-y-4">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-secondary-900">{product.name}</h4>
                    <p className="text-sm text-primary-600 font-medium">{product.subtitle}</p>
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
                    {product.targetMaturityLevels.includes(result.calculated_level) && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        ✓ Passt zu Ihrem Reifegrad
                      </span>
                    )}
                    {product.targetIndustries.includes(result.company_info.industry) && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        ✓ Branchenspezifisch
                      </span>
                    )}
                    {product.targetCompanySizes.includes(result.company_info.companySize) && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        ✓ Passende Größe
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
          
          {recommendedProducts.length === 0 && (
            <p className="text-secondary-600 text-center py-4">
              Basierend auf Ihrem Profil empfehlen wir eine individuelle Beratung zur optimalen Lösungsfindung.
            </p>
          )}
        </div>
      )}
      
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Hinweis:</strong> {error}
          </p>
        </div>
      )}
    </div>
  );
}
