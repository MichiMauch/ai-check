'use client';

import { AIProduct } from '@/types/assessment';

interface ProductRecommendationsProps {
  products: AIProduct[];
  companyInfo: {
    industry: string;
    companySize: string;
  };
}

export default function ProductRecommendations({ products, companyInfo }: ProductRecommendationsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">
          🎯 Empfohlene AI-Lösungen für Ihr Unternehmen
        </h3>
        <p className="text-secondary-600 mb-6">
          Basierend auf Ihrer AI-Maturity, Branche ({companyInfo.industry}) und Unternehmensgröße ({companyInfo.companySize}) empfehlen wir folgende maßgeschneiderte Lösungen:
        </p>

        <div className="grid gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900">
                      {product.name}
                    </h4>
                    <p className="text-sm text-secondary-500 uppercase tracking-wide">
                      {product.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-secondary-600">Preis</div>
                  <div className="font-semibold text-secondary-900">{product.pricing}</div>
                </div>
              </div>

              <p className="text-secondary-700 mb-4 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-secondary-600">
                  <div className="flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>{product.timeline}</span>
                  </div>
                </div>
                <button className="btn btn-primary text-sm px-4 py-2">
                  Mehr erfahren
                </button>
              </div>

              {/* Warum dieses Produkt empfohlen wird */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Warum für Sie geeignet:</strong> {getRecommendationReason(product, companyInfo)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getRecommendationReason(product: AIProduct, companyInfo: { industry: string; companySize: string }): string {
  const reasons = [];

  if (product.targetIndustries.includes(companyInfo.industry as any)) {
    reasons.push(`speziell für die ${companyInfo.industry}-Branche entwickelt`);
  }

  if (product.targetCompanySizes.includes(companyInfo.companySize as any)) {
    reasons.push(`optimal für Unternehmen Ihrer Größe`);
  }

  switch (product.id) {
    case 'experience-day':
      reasons.push('idealer Einstieg in die AI-Welt mit sofortigen praktischen Erkenntnissen');
      break;
    case 'innovation-sprint':
      reasons.push('schnelle Umsetzung Ihrer AI-Ideen mit garantierten Ergebnissen');
      break;
    case 'custom-chat-ui':
      reasons.push('unternehmensweite Wissensnutzung durch intelligente Assistenten');
      break;
    case 'custom-ai-solutions':
      reasons.push('maßgeschneiderte AI-Integration in Ihre bestehenden Geschäftsprozesse');
      break;
  }

  return reasons.length > 0 ? reasons.join(', ') : 'passt perfekt zu Ihrem aktuellen AI-Reifegrad';
}
