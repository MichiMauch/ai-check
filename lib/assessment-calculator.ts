import { AssessmentAnswer, AssessmentResult, MaturityLevel, MATURITY_LEVELS } from '@/types/assessment';

export class AssessmentCalculator {
  static calculateResult(
    selfAssessment: MaturityLevel,
    answers: AssessmentAnswer[]
  ): AssessmentResult {
    // Berechne Gesamtpunktzahl (max. 75 Punkte)
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
    
    // Bestimme berechnete Stufe basierend auf Punktzahl
    const calculatedLevel = this.getMaturityLevelFromScore(totalScore);
    
    // Berechne Delta zwischen Selbsteinschätzung und berechnetem Level
    const delta = this.calculateDelta(selfAssessment, calculatedLevel);
    
    // Generiere Beschreibung für berechnete Stufe
    const levelDescription = this.getLevelDescription(calculatedLevel);
    
    // Generiere Insight basierend auf Abweichung
    const insight = this.generateInsight(selfAssessment, calculatedLevel, delta);
    
    // Generiere Handlungsempfehlungen
    const nextSteps = this.generateNextSteps(calculatedLevel, totalScore);

    return {
      self_assessment: selfAssessment,
      calculated_level: calculatedLevel,
      score: totalScore,
      level_description: levelDescription,
      delta,
      insight,
      next_steps: nextSteps
    };
  }

  private static getMaturityLevelFromScore(score: number): MaturityLevel {
    if (score <= 15) return 'Digital AI Resister';
    if (score <= 30) return 'Digital AI Explorer';
    if (score <= 45) return 'Digital AI Player';
    if (score <= 60) return 'Digital AI Transformer';
    return 'Digital AI Disrupter';
  }

  private static calculateDelta(selfAssessment: MaturityLevel, calculatedLevel: MaturityLevel): string {
    const levels = MATURITY_LEVELS.map(l => l.name);
    const selfIndex = levels.indexOf(selfAssessment);
    const calculatedIndex = levels.indexOf(calculatedLevel);
    const difference = calculatedIndex - selfIndex;

    if (difference === 0) return '0';
    if (difference > 0) return `+${difference}`;
    return `${difference}`;
  }

  private static getLevelDescription(level: MaturityLevel): string {
    const levelInfo = MATURITY_LEVELS.find(l => l.name === level);
    return levelInfo?.description || '';
  }

  private static generateInsight(
    selfAssessment: MaturityLevel,
    calculatedLevel: MaturityLevel,
    delta: string
  ): string {
    const deltaValue = parseInt(delta);

    if (deltaValue === 0) {
      return 'Ihre Selbsteinschätzung entspricht dem berechneten Reifegrad. Sie haben eine realistische Sicht auf Ihren aktuellen AI-Status.';
    }

    if (deltaValue > 0) {
      return `Sie sind weiter fortgeschritten als ursprünglich angenommen! Ihr Unternehmen zeigt bereits stärkere AI-Reife als selbst eingeschätzt. Dies deutet auf vorhandene, möglicherweise noch nicht voll erkannte AI-Potentiale hin.`;
    }

    return `Ihre Selbsteinschätzung war etwas optimistischer als die Bewertung zeigt. Das ist völlig normal und bietet eine gute Ausgangslage, um konkrete Entwicklungsschritte zu definieren.`;
  }

  private static generateNextSteps(level: MaturityLevel, score: number): string {
    switch (level) {
      case 'Digital AI Resister':
        return 'Starten Sie mit der Sensibilisierung des Managements für AI-Potentiale. Organisieren Sie Workshops und definieren Sie erste Use Cases. Entwickeln Sie eine grundlegende AI-Strategie.';
      
      case 'Digital AI Explorer':
        return 'Formalisieren Sie Ihre AI-Initiativen durch eine klare Roadmap. Investieren Sie in Schulungen und pilotieren Sie erste konkrete AI-Anwendungen in ausgewählten Bereichen.';
      
      case 'Digital AI Player':
        return 'Skalieren Sie erfolgreiche AI-Anwendungen und bauen Sie interne AI-Expertise auf. Etablieren Sie Governance-Strukturen und integrieren Sie AI stärker in Ihre Geschäftsprozesse.';
      
      case 'Digital AI Transformer':
        return 'Erweitern Sie Ihre AI-Anwendungen auf neue Geschäftsbereiche. Entwickeln Sie innovative AI-basierte Services und stärken Sie Ihre Position als AI-Leader in Ihrer Branche.';
      
      case 'Digital AI Disrupter':
        return 'Nutzen Sie Ihre AI-Expertise für disruptive Innovationen. Teilen Sie Ihr Wissen als Thought Leader und erkunden Sie neue Geschäftsmodelle durch fortschrittliche AI-Technologien.';
      
      default:
        return 'Setzen Sie Ihre AI-Reise systematisch fort und passen Sie Ihre Strategie an die aktuellen Entwicklungen an.';
    }
  }
}
