import { AssessmentAnswer, AssessmentResult, MaturityLevel, MATURITY_LEVELS, CompanyInfo } from '@/types/assessment';

export class AssessmentCalculator {
  static calculateResult(
    selfAssessment: MaturityLevel,
    answers: AssessmentAnswer[],
    companyInfo: CompanyInfo
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
    const nextSteps = this.generateNextSteps(calculatedLevel, totalScore, companyInfo);

    return {
      company_info: companyInfo,
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

  private static generateNextSteps(level: MaturityLevel, score: number, companyInfo: CompanyInfo): string {
    let baseSteps = '';
    
    switch (level) {
      case 'Digital AI Resister':
        baseSteps = 'Starten Sie mit der Sensibilisierung des Managements für AI-Potentiale. Organisieren Sie Workshops und definieren Sie erste Use Cases. Entwickeln Sie eine grundlegende AI-Strategie.';
        break;
      case 'Digital AI Explorer':
        baseSteps = 'Formalisieren Sie Ihre AI-Initiativen durch eine klare Roadmap. Investieren Sie in Schulungen und pilotieren Sie erste konkrete AI-Anwendungen in ausgewählten Bereichen.';
        break;
      case 'Digital AI Player':
        baseSteps = 'Skalieren Sie erfolgreiche AI-Anwendungen und bauen Sie interne AI-Expertise auf. Etablieren Sie Governance-Strukturen und integrieren Sie AI stärker in Ihre Geschäftsprozesse.';
        break;
      case 'Digital AI Transformer':
        baseSteps = 'Erweitern Sie Ihre AI-Anwendungen auf neue Geschäftsbereiche. Entwickeln Sie innovative AI-basierte Services und stärken Sie Ihre Position als AI-Leader in Ihrer Branche.';
        break;
      case 'Digital AI Disrupter':
        baseSteps = 'Nutzen Sie Ihre AI-Expertise für disruptive Innovationen. Teilen Sie Ihr Wissen als Thought Leader und erkunden Sie neue Geschäftsmodelle durch fortschrittliche AI-Technologien.';
        break;
      default:
        baseSteps = 'Setzen Sie Ihre AI-Reise systematisch fort und passen Sie Ihre Strategie an die aktuellen Entwicklungen an.';
    }

    // Branchenspezifische Ergänzungen
    let industryAddition = '';
    switch (companyInfo.industry) {
      case 'Banking & Finance':
        industryAddition = ' Fokussieren Sie sich auf Fraud Detection, automatisierte Kreditbewertung und Robo-Advisory Services.';
        break;
      case 'Gesundheitswesen':
        industryAddition = ' Priorisieren Sie Diagnose-Unterstützung, Patientendatenanalyse und administrative Automatisierung.';
        break;
      case 'Einzelhandel':
        industryAddition = ' Implementieren Sie Empfehlungssysteme, Nachfrageprognosen und personalisierte Kundenerlebnisse.';
        break;
      case 'Produktion & Fertigung':
        industryAddition = ' Setzen Sie auf Predictive Maintenance, Qualitätskontrolle und Supply Chain Optimierung.';
        break;
      case 'IT & Software':
        industryAddition = ' Nutzen Sie AI für Code-Generierung, automatisierte Tests und intelligente DevOps-Prozesse.';
        break;
      case 'Automotive':
        industryAddition = ' Fokus auf autonomes Fahren, Produktionsoptimierung und vernetzte Fahrzeugdienste.';
        break;
      default:
        industryAddition = ' Identifizieren Sie AI-Anwendungsfälle, die spezifisch für Ihre Branche relevant sind.';
    }

    // Größenspezifische Ergänzungen
    let sizeAddition = '';
    if (companyInfo.companySize.includes('Kleinstunternehmen') || companyInfo.companySize.includes('Kleinunternehmen')) {
      sizeAddition = ' Als kleineres Unternehmen starten Sie mit kostengünstigen SaaS-AI-Lösungen und externen Partnerschaften.';
    } else if (companyInfo.companySize.includes('Konzern')) {
      sizeAddition = ' Als Konzern können Sie in eigene AI-Teams investieren und komplexe, unternehmensweite AI-Initiativen umsetzen.';
    } else {
      sizeAddition = ' Nutzen Sie Ihre Größe für gezielte Pilotprojekte und den schrittweisen Aufbau interner AI-Kompetenz.';
    }

    return baseSteps + industryAddition + sizeAddition;
  }
}
