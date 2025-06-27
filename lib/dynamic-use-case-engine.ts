import OpenAI from 'openai';
import type { AIUseCase, UseCaseRecommendation } from '@/types/use-case';
import type { AssessmentResult } from '@/types/assessment';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 Sekunden Timeout (reduziert von 45)
  maxRetries: 1,  // Nur 1 Wiederholung (reduziert von 2)
});

export class DynamicUseCaseEngine {

  async generateRecommendations(assessmentResult: AssessmentResult): Promise<UseCaseRecommendation[]> {
    const startTime = Date.now();
    
    try {
      console.log('Starting OpenAI use case generation...');
      const prompt = this.buildPrompt(assessmentResult);
      
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini', // GPT-4o-mini für Speed mit Qualität
        messages: [
          {
            role: 'system',
            content: `Du bist ein AI-Strategieexperte. Generiere EXAKT 5 Use Cases in JSON Format. Sei prägnant und schnell.
            
            REGELN:
            - IMMER genau 5 Use Cases
            - Kosten in CHF
            - ROI 100-400%
            - Praktische Use Cases
            - JSON Array Format
            
            Antworte NUR mit JSON - keine zusätzlichen Texte!`
          },
          {
            role: 'user',
            content: this.buildPrompt(assessmentResult) // Bestehender Prompt
          }
        ],
        temperature: 0.1, // Sehr niedrig für Speed und Konsistenz
        max_tokens: 2500, // Reduziert für schnellere Antworten
      });

      const openaiTime = Date.now() - startTime;
      console.log(`OpenAI API call completed in ${openaiTime}ms`);

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      console.log('Raw OpenAI Response length:', content.length);
      console.log('First 200 chars:', content.substring(0, 200));

      // Clean und parse JSON Response
      let cleanContent = content.trim();
      
      // Entferne eventuelle Markdown-Blöcke
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      console.log('Cleaned content length:', cleanContent.length);

      const useCases: AIUseCase[] = JSON.parse(cleanContent);
      console.log('Parsed use cases count:', useCases.length);
      
      // Konvertiere zu Recommendations mit Scores
      const recommendations: UseCaseRecommendation[] = useCases.map((useCase, index) => ({
        useCase,
        feasibilityScore: this.calculateFeasibilityScore(useCase, assessmentResult),
        priorityScore: 90 - (index * 10), // Absteigend nach OpenAI Reihenfolge
        reasoning: this.generateReasoning(useCase, assessmentResult),
        adaptedSteps: useCase.nextSteps
      }));

      return recommendations;

    } catch (error) {
      const openaiTime = Date.now() - startTime;
      console.error('=== DYNAMIC USE CASE GENERATION FAILED ===');
      console.error('Error after', openaiTime + 'ms');
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Full error:', error);
      
      // Fallback: Wenn OpenAI fehlschlägt, generiere statische Fallback-Use Cases
      console.log('Falling back to static use cases...');
      return this.generateFallbackUseCases(assessmentResult);
    }
  }

  private buildPrompt(assessment: AssessmentResult): string {
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

    const companySizeMap = {
      'Kleinstunternehmen (1-9 Mitarbeiter)': { budget: '10.000-50.000', resources: 'sehr begrenzt' },
      'Kleinunternehmen (10-49 Mitarbeiter)': { budget: '25.000-100.000', resources: 'begrenzt' },
      'Mittleres Unternehmen (50-249 Mitarbeiter)': { budget: '50.000-300.000', resources: 'mittel' },
      'Großunternehmen (250-999 Mitarbeiter)': { budget: '100.000-1.000.000', resources: 'gut' },
      'Konzern (1000+ Mitarbeiter)': { budget: '500.000-5.000.000', resources: 'sehr gut' }
    };

    const maturityLevel = assessment.calculated_level;
    const industry = industryMap[assessment.company_info.industry] || 'Allgemein';
    const companyInfo = companySizeMap[assessment.company_info.companySize];
    const score = assessment.score;

    return `
UNTERNEHMENSPROFIL:
- Branche: ${industry}
- Unternehmensgröße: ${assessment.company_info.companySize}
- AI-Maturity Level: ${maturityLevel}
- Assessment Score: ${score}/75 Punkte
- Geschätztes Budget: ${companyInfo?.budget} CHF
- Ressourcen: ${companyInfo?.resources}

AUFGABE:
Generiere genau 5 AI Use Cases für dieses Unternehmen, sortiert nach Priorität (höchste zuerst).

AUSGABEFORMAT (JSON Array):
[
  {
    "id": "eindeutige-id",
    "title": "Prägnanter Titel",
    "description": "Detaillierte Beschreibung des Use Cases (2-3 Sätze)",
    "industry": "${assessment.company_info.industry}",
    "category": "automation|analytics|customer-experience|operations|innovation",
    "complexity": "low|medium|high",
    "timeToImplement": "z.B. '2-4 Monate'",
    "requiredMaturityLevel": "beginner|intermediate|advanced|expert",
    "estimatedCost": {
      "min": 0000,
      "max": 0000,
      "currency": "CHF"
    },
    "estimatedROI": {
      "timeframe": "z.B. '12 Monate'",
      "percentage": 000,
      "description": "Konkrete ROI Beschreibung"
    },
    "prerequisites": ["Voraussetzung 1", "Voraussetzung 2", "Voraussetzung 3"],
    "benefits": ["Vorteil 1", "Vorteil 2", "Vorteil 3"],
    "risks": ["Risiko 1", "Risiko 2", "Risiko 3"],
    "technologies": ["Technologie 1", "Technologie 2"],
    "nextSteps": ["Schritt 1", "Schritt 2", "Schritt 3", "Schritt 4"]
  }
]

WICHTIGE GUIDELINES:
- Angepasst an Maturity Level: ${maturityLevel}
- Kosten realistisch für ${assessment.company_info.companySize}
- ROI zwischen 120-350% je nach Komplexität
- Implementierungszeit: 2-18 Monate je nach Complexity
- Complexity angepasst an Score ${score}/75
- Branchenspezifisch für ${industry}
- Alle Texte auf Deutsch
- Konkrete, umsetzbare Use Cases
- Quick Wins für niedrige Maturity Levels priorisieren
`;
  }

  private calculateFeasibilityScore(useCase: AIUseCase, assessment: AssessmentResult): number {
    let score = 60; // Baseline

    // Maturity Level Match
    const userScore = assessment.score;
    if (useCase.complexity === 'low' && userScore < 40) score += 20;
    else if (useCase.complexity === 'medium' && userScore >= 30) score += 10;
    else if (useCase.complexity === 'high' && userScore >= 50) score += 15;
    else score -= 15;

    // Cost vs Company Size
    const maxCost = useCase.estimatedCost.max;
    if (assessment.company_info.companySize.includes('1-9') && maxCost <= 50000) score += 15;
    else if (assessment.company_info.companySize.includes('10-49') && maxCost <= 100000) score += 10;
    else if (assessment.company_info.companySize.includes('50-249') && maxCost <= 300000) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private generateReasoning(useCase: AIUseCase, assessment: AssessmentResult): string {
    const reasons = [];

    if (useCase.complexity === 'low') {
      reasons.push("Einfache Umsetzung, ideal für den Einstieg");
    }

    if (useCase.estimatedROI.percentage > 200) {
      reasons.push("Sehr hoher ROI erwartet");
    }

    if (useCase.category === 'automation' && assessment.score < 50) {
      reasons.push("Automatisierung bringt schnelle Erfolge");
    }

    return reasons.length > 0 ? reasons.join(". ") + "." : "Passt gut zu Ihrem aktuellen Entwicklungsstand.";
  }

  private generateFallbackUseCases(assessment: AssessmentResult): UseCaseRecommendation[] {
    // Einfache Fallback Use Cases falls OpenAI nicht verfügbar
    const fallbackUseCase: AIUseCase = {
      id: 'fallback-automation',
      title: 'Prozessautomatisierung',
      description: 'Automatisierung wiederkehrender Geschäftsprozesse zur Effizienzsteigerung',
      industry: assessment.company_info.industry,
      category: 'automation',
      complexity: 'low',
      timeToImplement: '2-4 Monate',
      requiredMaturityLevel: 'beginner',
      estimatedCost: { min: 20000, max: 80000, currency: 'CHF' },
      estimatedROI: {
        timeframe: '12 Monate',
        percentage: 200,
        description: 'Zeitersparnis und Kostenreduktion'
      },
      prerequisites: ['Dokumentierte Prozesse', 'Management Buy-in'],
      benefits: ['Effizienzsteigerung', 'Kosteneinsparung', 'Weniger Fehler'],
      risks: ['Change Management', 'Wartungsaufwand'],
      technologies: ['RPA', 'Workflow Automation'],
      nextSteps: ['Prozessanalyse', 'Tool-Auswahl', 'Pilotprojekt', 'Rollout']
    };

    return [{
      useCase: fallbackUseCase,
      feasibilityScore: 80,
      priorityScore: 75,
      reasoning: "OpenAI nicht verfügbar, aber dieser Use Case ist grundsätzlich für alle Unternehmen geeignet.",
      adaptedSteps: fallbackUseCase.nextSteps
    }];
  }
}

export const dynamicUseCaseEngine = new DynamicUseCaseEngine();
