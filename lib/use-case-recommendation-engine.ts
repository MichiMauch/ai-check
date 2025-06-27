import { AI_USE_CASES, getUseCasesByIndustry } from '@/lib/ai-use-cases-db';
import type { AIUseCase, UseCaseRecommendation } from '@/types/use-case';
import type { AssessmentResult } from '@/types/assessment';

export class UseCaseRecommendationEngine {
  
  // Hauptmethode: Generiere Empfehlungen basierend auf Assessment
  generateRecommendations(assessmentResult: AssessmentResult): UseCaseRecommendation[] {
    let industryUseCases = getUseCasesByIndustry(assessmentResult.company_info.industry);
    
    // Fallback: Falls keine branchenspezifischen Use Cases vorhanden, nutze allgemeine + ähnliche Branchen
    if (industryUseCases.length === 0) {
      // Allgemeine Use Cases hinzufügen
      industryUseCases = getUseCasesByIndustry('other');
      
      // Ähnliche Branchen hinzufügen basierend auf Kategorien
      const similarIndustries = this.getSimilarIndustries(assessmentResult.company_info.industry);
      similarIndustries.forEach(industry => {
        industryUseCases = [...industryUseCases, ...getUseCasesByIndustry(industry)];
      });
    }
    
    const userMaturityLevel = this.mapLevelToMaturity(assessmentResult.calculated_level);
    const companySize = assessmentResult.company_info.companySize;
    
    const recommendations = industryUseCases.map(useCase => {
      const feasibilityScore = this.calculateFeasibilityScore(useCase, assessmentResult);
      const priorityScore = this.calculatePriorityScore(useCase, assessmentResult);
      const reasoning = this.generateReasoning(useCase, assessmentResult, feasibilityScore);
      const adaptedSteps = this.adaptNextSteps(useCase, assessmentResult);
      
      return {
        useCase,
        feasibilityScore,
        priorityScore,
        reasoning,
        adaptedSteps
      };
    });

    // Sortiere nach Priorität und Machbarkeit
    return recommendations
      .sort((a, b) => (b.priorityScore + b.feasibilityScore) - (a.priorityScore + a.feasibilityScore))
      .slice(0, 5); // Top 5 Empfehlungen
  }

  // Machbarkeits-Score berechnen (0-100)
  private calculateFeasibilityScore(useCase: AIUseCase, assessment: AssessmentResult): number {
    let score = 50; // Baseline
    
    // Maturity Level Check
    const userMaturity = this.mapLevelToMaturity(assessment.calculated_level);
    const requiredMaturity = this.getMaturityNumeric(useCase.requiredMaturityLevel);
    
    if (userMaturity >= requiredMaturity) {
      score += 30;
    } else if (userMaturity >= requiredMaturity - 1) {
      score += 15; // Knapp drunter
    } else {
      score -= 20; // Zu niedrig
    }
    
    // Komplexität vs. Erfahrung
    const complexityPenalty = {
      'low': 0,
      'medium': assessment.score < 40 ? -10 : 5,
      'high': assessment.score < 50 ? -25 : 10
    };
    score += complexityPenalty[useCase.complexity];
    
    // Company Size Faktor
    const sizeFactor = this.getCompanySizeFactor(assessment.company_info.companySize);
    if (useCase.estimatedCost.max > sizeFactor.budgetThreshold) {
      score -= 15;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  // Prioritäts-Score berechnen (0-100)
  private calculatePriorityScore(useCase: AIUseCase, assessment: AssessmentResult): number {
    let score = 50; // Baseline
    
    // ROI Score
    if (useCase.estimatedROI.percentage > 200) score += 20;
    else if (useCase.estimatedROI.percentage > 150) score += 10;
    
    // Time to Value
    const timeValue = {
      '2-4 weeks': 20,
      '6-12 Wochen': 15,
      '2-4 Monate': 10,
      '3-6 Monate': 5,
      '6-12 Monate': -5
    };
    score += timeValue[useCase.timeToImplement as keyof typeof timeValue] || 0;
    
    // Quick Win für niedrigere Maturity
    if (assessment.score < 40 && useCase.complexity === 'low') {
      score += 15; // Quick Wins priorisieren
    }
    
    // Category Relevanz basierend auf Assessment-Schwächen
    score += this.getCategoryRelevanceScore(useCase.category, assessment);
    
    return Math.max(0, Math.min(100, score));
  }

  // Begründung generieren
  private generateReasoning(
    useCase: AIUseCase, 
    assessment: AssessmentResult, 
    feasibilityScore: number
  ): string {
    const reasons = [];
    
    if (feasibilityScore >= 70) {
      reasons.push("Sehr gut umsetzbar für Ihr aktuelles Reifelevel");
    } else if (feasibilityScore >= 50) {
      reasons.push("Mit etwas Vorbereitung gut umsetzbar");
    } else {
      reasons.push("Benötigt zunächst Aufbau von Grundlagen");
    }
    
    if (useCase.complexity === 'low' && assessment.score < 40) {
      reasons.push("Idealer Einstieg in AI-Projekte");
    }
    
    if (useCase.estimatedROI.percentage > 200) {
      reasons.push("Sehr hoher ROI erwartet");
    }
    
    if (useCase.category === 'automation' && assessment.score >= 50) {
      reasons.push("Passt gut zu Ihrer bereits vorhandenen Automatisierungserfahrung");
    }
    
    return reasons.join(". ") + ".";
  }

  // Next Steps an Assessment anpassen
  private adaptNextSteps(useCase: AIUseCase, assessment: AssessmentResult): string[] {
    const adaptedSteps = [...useCase.nextSteps];
    
    // Zusätzliche Schritte je nach Maturity Level
    if (assessment.score < 30) {
      adaptedSteps.unshift("Grundlagen-Workshop zu AI/ML durchführen");
      adaptedSteps.unshift("AI-Strategie und Governance definieren");
    }
    
    if (assessment.calculated_level === "Digital AI Resister" || assessment.calculated_level === "Digital AI Explorer") {
      adaptedSteps.push("Change Management für AI-Einführung planen");
      adaptedSteps.push("Team-Training und Weiterbildung organisieren");
    }
    
    // Company Size spezifische Anpassungen
    const companySize = assessment.company_info.companySize;
    if (companySize === "Kleinstunternehmen (1-9 Mitarbeiter)" || companySize === "Kleinunternehmen (10-49 Mitarbeiter)") {
      adaptedSteps.push("Externe AI-Beratung in Betracht ziehen");
      adaptedSteps.push("SaaS-Lösungen bevorzugt evaluieren");
    }
    
    return adaptedSteps;
  }

  // Hilfsmethoden
  private mapLevelToMaturity(level: string): number {
    const mapping = {
      "Digital AI Resister": 1,
      "Digital AI Explorer": 2,
      "Digital AI Player": 3,
      "Digital AI Transformer": 4,
      "Digital AI Disrupter": 5
    };
    return mapping[level as keyof typeof mapping] || 1;
  }

  private getMaturityNumeric(level: AIUseCase['requiredMaturityLevel']): number {
    const mapping = {
      "beginner": 1,
      "intermediate": 2,
      "advanced": 3,
      "expert": 4
    };
    return mapping[level];
  }

  private getCompanySizeFactor(size: string) {
    const factors = {
      "Kleinstunternehmen (1-9 Mitarbeiter)": { budgetThreshold: 25000, resourceMultiplier: 0.5 },
      "Kleinunternehmen (10-49 Mitarbeiter)": { budgetThreshold: 75000, resourceMultiplier: 0.7 },
      "Mittleres Unternehmen (50-249 Mitarbeiter)": { budgetThreshold: 200000, resourceMultiplier: 1.0 },
      "Großunternehmen (250-999 Mitarbeiter)": { budgetThreshold: 500000, resourceMultiplier: 1.5 },
      "Konzern (1000+ Mitarbeiter)": { budgetThreshold: 1000000, resourceMultiplier: 2.0 }
    };
    return factors[size as keyof typeof factors] || factors["Mittleres Unternehmen (50-249 Mitarbeiter)"];
  }

  private getCategoryRelevanceScore(category: AIUseCase['category'], assessment: AssessmentResult): number {
    // Basierend auf Assessment-Antworten könnten wir erkennen, 
    // welche Bereiche am wichtigsten sind
    const scores = {
      'automation': assessment.score < 40 ? 10 : 5,
      'analytics': assessment.score >= 40 ? 10 : 0,
      'customer-experience': 8,
      'operations': 6,
      'innovation': assessment.score >= 60 ? 10 : 0
    };
    return scores[category] || 0;
  }

  // Ähnliche Branchen für Fallback-Empfehlungen
  private getSimilarIndustries(industry: string): string[] {
    const similarityMap: Record<string, string[]> = {
      'banking-finance': ['insurance', 'consulting'],
      'insurance': ['banking-finance', 'consulting'],
      'consulting': ['banking-finance', 'insurance', 'it-software'],
      'it-software': ['consulting', 'telecom'],
      'telecom': ['it-software', 'media'],
      'media': ['telecom', 'tourism'],
      'healthcare': ['education', 'public'],
      'education': ['healthcare', 'public'],
      'public': ['education', 'healthcare'],
      'automotive': ['manufacturing', 'logistics'],
      'manufacturing': ['automotive', 'production'],
      'production': ['manufacturing', 'logistics'],
      'logistics': ['automotive', 'production', 'retail'],
      'retail': ['logistics', 'tourism'],
      'tourism': ['retail', 'media'],
      'energy': ['manufacturing', 'public'],
      'chemical-pharma': ['manufacturing', 'healthcare']
    };
    
    return similarityMap[industry] || ['other'];
  }
}

export const useCaseEngine = new UseCaseRecommendationEngine();
