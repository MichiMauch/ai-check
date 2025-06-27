import { NextRequest, NextResponse } from 'next/server';
import { AssessmentResult } from '@/types/assessment';
import { dynamicUseCaseEngine } from '@/lib/dynamic-use-case-engine';

export const maxDuration = 45; // 45 seconds for combined AI generation
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { result }: { result: AssessmentResult } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API Key not configured');
      return NextResponse.json({
        recommendation: generateFallbackRecommendation(result),
        topUseCases: [],
        processingTimeMs: Date.now() - startTime
      });
    }

    // Parallel: Use Cases und Empfehlung generieren
    const [useCaseRecommendations, aiRecommendation] = await Promise.all([
      dynamicUseCaseEngine.generateRecommendations(result),
      generateShortRecommendation(result)
    ]);

    // Top 2 Use Cases nehmen
    const topUseCases = useCaseRecommendations.slice(0, 2);

    const processingTime = Date.now() - startTime;
    console.log('Combined AI generation completed in:', processingTime + 'ms');

    return NextResponse.json({
      recommendation: aiRecommendation,
      topUseCases,
      meta: {
        processingTimeMs: processingTime,
        generationType: 'ai-optimized-with-usecases',
        useCaseCount: topUseCases.length
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Combined AI recommendation error:', error);
    
    return NextResponse.json({
      recommendation: generateFallbackRecommendation(result),
      topUseCases: [],
      meta: {
        processingTimeMs: processingTime,
        generationType: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}

async function generateShortRecommendation(result: AssessmentResult): Promise<string> {
  const { default: OpenAI } = await import('openai');
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 25000, // 25s für kürzere Empfehlung
    maxRetries: 1,
  });

  const industryMap = {
    'automotive': 'Automotive',
    'banking-finance': 'Banking & Finance', 
    'consulting': 'Beratung & Consulting',
    'education': 'Bildung & Forschung',
    'chemical-pharma': 'Chemie & Pharma',
    'retail': 'Einzelhandel',
    'energy': 'Energie & Umwelt',
    'healthcare': 'Gesundheitswesen',
    'it-software': 'IT & Software',
    'logistics': 'Logistik & Transport',
    'manufacturing': 'Maschinenbau',
    'media': 'Medien & Marketing',
    'public': 'Öffentliche Verwaltung',
    'production': 'Produktion & Fertigung',
    'telecom': 'Telekommunikation',
    'tourism': 'Tourismus & Gastronomie',
    'insurance': 'Versicherung',
    'other': 'Sonstige'
  };

  const prompt = `
Erstelle eine KURZE, prägnante AI-Empfehlung für ein Unternehmen.

UNTERNEHMENSDATEN:
- Branche: ${industryMap[result.company_info.industry] || result.company_info.industry}
- Größe: ${result.company_info.companySize}
- AI-Maturity Level: ${result.calculated_level}
- Assessment Score: ${result.score}/75 Punkte

ANFORDERUNGEN:
- Maximal 3-4 Sätze
- Konkrete, actionable Empfehlungen
- Fokus auf nächste Schritte
- Branchenspezifisch
- Deutsch
- Direkte Ansprache ("Sie sollten...")

Sei prägnant und hilfreich!`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system', 
        content: 'Du bist ein AI-Berater. Antworte kurz, prägnant und actionable. Maximal 4 Sätze.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 300, // Kurze Antwort erzwingen
  });

  return response.choices[0]?.message?.content || 'Empfehlung konnte nicht generiert werden.';
}

function generateFallbackRecommendation(result: AssessmentResult): string {
  const level = result.calculated_level;
  
  if (level === 'Digital AI Resister') {
    return `Ihr Unternehmen steht am Anfang der AI-Journey. Konzentrieren Sie sich zunächst auf einfache Automatisierungsprojekte und den Aufbau von Datenstrukturen. Ein Pilotprojekt in der Prozessautomatisierung wäre ein idealer Startpunkt.`;
  } else if (level === 'Digital AI Explorer') {
    return `Sie erkunden bereits AI-Möglichkeiten. Erweitern Sie Ihre AI-Anwendungen auf Analytics und erste Automatisierungen. Investieren Sie in die Schulung Ihrer Teams und definieren Sie klare AI-Ziele.`;
  } else if (level === 'Digital AI Player') {
    return `Sie haben bereits eine solide Basis. Erweitern Sie Ihre AI-Anwendungen auf Analytics und Predictive Maintenance. Investieren Sie in die Schulung Ihrer Teams und etablieren Sie AI-Governance-Prozesse.`;
  } else if (level === 'Digital AI Transformer') {
    return `Ihr Unternehmen ist bereits gut positioniert. Fokussieren Sie sich auf komplexe AI-Projekte, Innovation und die Skalierung bestehender Lösungen. Machine Learning und Custom AI-Modelle bieten großes Potenzial.`;
  } else {
    return `Sie sind AI-Vorreiter. Nutzen Sie Ihre Expertise für strategische Innovation, entwickeln Sie eigene AI-Produkte und werden Sie zum Benchmark in Ihrer Branche.`;
  }
}
