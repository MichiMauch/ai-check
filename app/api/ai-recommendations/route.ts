import { NextRequest, NextResponse } from 'next/server';
import { AssessmentResult, AI_PRODUCTS } from '@/types/assessment';

export async function POST(request: NextRequest) {
  try {
    const { result, includeProducts }: { result: AssessmentResult, includeProducts?: boolean } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API Key not configured');
      return NextResponse.json(
        { 
          error: 'AI recommendations are currently not available. Please configure OpenAI API key.',
          recommendation: generateFallbackRecommendation(result, includeProducts)
        },
        { status: 200 } // Return 200 but with fallback
      );
    }

    // Filter passende Produkte für die AI-Empfehlung
    const getRecommendedProducts = () => {
      return AI_PRODUCTS.filter((product) => {
        const matchesMaturity = product.targetMaturityLevels.includes(result.calculated_level);
        const matchesIndustry = product.targetIndustries.includes(result.company_info.industry);
        const matchesSize = product.targetCompanySizes.includes(result.company_info.companySize);
        const matchCount = [matchesMaturity, matchesIndustry, matchesSize].filter(Boolean).length;
        return matchCount >= 2;
      });
    };

    const recommendedProducts = getRecommendedProducts();
    
    // Produktinformationen für den Prompt vorbereiten
    const productInfo = includeProducts && recommendedProducts.length > 0 
      ? `\n\nPassende Lösungen für dieses Unternehmen:
${recommendedProducts.map(product => `
- **${product.name}** (${product.pricing}, ${product.timeline}): ${product.description}
  Zielgruppe: ${product.targetMaturityLevels.join(', ')} | ${product.targetIndustries.slice(0,3).join(', ')} | ${product.targetCompanySizes.slice(0,2).join(', ')}`).join('')}`
      : '';

    const prompt = `
Du bist ein AI-Berater und sollst basierend auf dem folgenden AI-Maturity Assessment eine ausführliche, personalisierte Empfehlung erstellen.

Assessment Ergebnisse:
- Unternehmen: ${result.company_info.industry}, ${result.company_info.companySize}
- Selbsteinschätzung: ${result.self_assessment}
- Berechneter Reifegrad: ${result.calculated_level}
- Score: ${result.score}/75
- Delta: ${result.delta}${productInfo}

Erstelle eine ausführliche, strukturierte Empfehlung (ca. 400-500 Wörter) die folgende Punkte abdeckt:

1. **Aktuelle Situation**: Bewertung des aktuellen AI-Reifegrads
2. **Branchenkontext**: Spezifische AI-Trends und Herausforderungen in der ${result.company_info.industry} Branche
3. **Größenspezifische Strategie**: Empfehlungen passend zur Unternehmensgröße (${result.company_info.companySize})
4. **Konkrete nächste Schritte**: 3-4 prioritäre Handlungsempfehlungen
5. **Zeitrahmen**: Realistische Meilensteine für die nächsten 6-12 Monate
6. **Risiken & Chancen**: Was passiert bei Handeln vs. Nicht-Handeln${includeProducts && recommendedProducts.length > 0 ? `
7. **Empfohlene Lösungen**: Kurze Erwähnung der passenden Lösungsansätze und warum sie für dieses Unternehmen geeignet sind` : ''}

Schreibe professionell, praxisorientiert und ermutigend. Verwende "Sie" als Anrede.${includeProducts ? ' Erwähne am Ende kurz unsere passenden Lösungen als konkrete Umsetzungshilfe.' : ''}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein erfahrener AI-Strategieberater, der Unternehmen bei ihrer digitalen Transformation unterstützt.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const recommendation = data.choices[0]?.message?.content || generateFallbackRecommendation(result, includeProducts);

    return NextResponse.json({ recommendation });

  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    
    // Fallback to static recommendation if API fails
    const body = await request.json();
    const fallbackRecommendation = generateFallbackRecommendation(body.result, body.includeProducts);
    
    return NextResponse.json({ 
      recommendation: fallbackRecommendation,
      error: 'AI-generated recommendations temporarily unavailable. Showing standard recommendations.'
    });
  }
}

function generateFallbackRecommendation(result: AssessmentResult, includeProducts: boolean = false): string {
  const recommendedProducts = includeProducts ? AI_PRODUCTS.filter((product) => {
    const matchesMaturity = product.targetMaturityLevels.includes(result.calculated_level);
    const matchesIndustry = product.targetIndustries.includes(result.company_info.industry);
    const matchesSize = product.targetCompanySizes.includes(result.company_info.companySize);
    const matchCount = [matchesMaturity, matchesIndustry, matchesSize].filter(Boolean).length;
    return matchCount >= 2;
  }) : [];

  const productSection = includeProducts && recommendedProducts.length > 0 
    ? `\n\n**Empfohlene Lösungen für Sie**\n${recommendedProducts.map(product => 
        `• **${product.name}**: ${product.description.substring(0, 100)}... (${product.pricing}, ${product.timeline})`
      ).join('\n')}\n\nDiese Lösungen sind speziell auf Ihren Reifegrad und Ihre Branche zugeschnitten.`
    : '';

  return `
**Ihre AI-Transformation: Nächste Schritte**

**Aktuelle Situation**
Ihr Unternehmen befindet sich auf der Stufe "${result.calculated_level}" mit einem Score von ${result.score}/75 Punkten. ${result.insight}

**Branchenspezifische Empfehlungen für ${result.company_info.industry}**
Als ${result.company_info.companySize} in der ${result.company_info.industry} sollten Sie sich auf praxisnahe AI-Anwendungen konzentrieren, die schnell Mehrwert generieren.

**Konkrete nächste Schritte:**
1. **Kurzfristig (1-3 Monate)**: Team-Schulungen und erste AI-Tool-Tests
2. **Mittelfristig (3-6 Monate)**: Pilotprojekt in einem spezifischen Bereich
3. **Langfristig (6-12 Monate)**: Skalierung erfolgreicher AI-Anwendungen

**Empfehlung:** ${result.next_steps}${productSection}

Beginnen Sie mit kleinen, messbaren Schritten und bauen Sie schrittweise Expertise auf. AI ist eine Reise, kein Sprint.
  `.trim();
}
