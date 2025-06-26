import { AssessmentResult, AI_PRODUCTS, AIProduct } from '@/types/assessment';

export class AIRecommendationEngine {
  static generateRecommendations(result: AssessmentResult): AIProduct[] {
    const { company_info, calculated_level } = result;
    
    // Filter Produkte basierend auf Maturity Level, Branche und Firmengrösse
    const relevantProducts = AI_PRODUCTS.filter(product => {
      const matchesMaturity = product.targetMaturityLevels.includes(calculated_level);
      const matchesIndustry = product.targetIndustries.includes(company_info.industry);
      const matchesSize = product.targetCompanySizes.includes(company_info.companySize);
      
      // Ein Produkt ist relevant wenn es mindestens 2 von 3 Kriterien erfüllt
      const matchCount = [matchesMaturity, matchesIndustry, matchesSize].filter(Boolean).length;
      return matchCount >= 2;
    });

    // Sortiere nach Relevanz (Maturity Level hat höchste Priorität)
    return relevantProducts.sort((a, b) => {
      const aMaturityMatch = a.targetMaturityLevels.includes(calculated_level) ? 1 : 0;
      const bMaturityMatch = b.targetMaturityLevels.includes(calculated_level) ? 1 : 0;
      return bMaturityMatch - aMaturityMatch;
    });
  }

  static generateDetailedRecommendation(result: AssessmentResult): string {
    const { company_info, calculated_level, score } = result;
    
    // Basis-Empfehlung basierend auf Maturity Level
    let recommendation = this.getBaseRecommendation(calculated_level, score);
    
    // Branchenspezifische Ergänzungen
    recommendation += this.getIndustrySpecificAdvice(company_info.industry, calculated_level);
    
    // Grössenspezifische Empfehlungen
    recommendation += this.getCompanySizeAdvice(company_info.companySize, calculated_level);
    
    return recommendation;
  }

  private static getBaseRecommendation(level: string, score: number): string {
    switch (level) {
      case 'Digital AI Resister':
        return `Mit einem Score von ${score}/75 Punkten befinden Sie sich in der Anfangsphase Ihrer AI-Reise. Dies ist eine ausgezeichnete Ausgangslage, um systematisch zu starten:\n\n`;
      
      case 'Digital AI Explorer':
        return `Ihr Score von ${score}/75 zeigt, dass Sie bereits erste wichtige Schritte unternommen haben. Jetzt geht es darum, diese Experimente zu strukturieren:\n\n`;
      
      case 'Digital AI Player':
        return `Mit ${score}/75 Punkten haben Sie eine solide Basis geschaffen. Der nächste Schritt ist die Skalierung Ihrer AI-Initiativen:\n\n`;
      
      case 'Digital AI Transformer':
        return `Ihr Score von ${score}/75 zeigt eine starke AI-Integration. Fokussieren Sie sich nun auf Innovation und Marktführerschaft:\n\n`;
      
      case 'Digital AI Disrupter':
        return `Exzellent! Mit ${score}/75 Punkten sind Sie bereits AI-Leader. Nutzen Sie diese Position für disruptive Innovationen:\n\n`;
      
      default:
        return `Basierend auf Ihrem Score von ${score}/75 empfehlen wir folgende Schritte:\n\n`;
    }
  }

  private static getIndustrySpecificAdvice(industry: string, level: string): string {
    const industryAdvice: Record<string, string> = {
      'Banking & Finance': '• Fokus auf Compliance und Risikomanagement bei AI-Implementierung\n• Fraud Detection und Customer Experience als Einstiegspunkte\n• Regulatorische Anforderungen von Beginn an mitdenken\n\n',
      'Gesundheitswesen': '• Datenschutz und medizinische Compliance als oberste Priorität\n• AI für Diagnostik und Patientenbetreuung als Startbereich\n• Interoperabilität mit bestehenden Systemen berücksichtigen\n\n',
      'Produktion & Fertigung': '• Predictive Maintenance als idealer Einstiegspunkt\n• Qualitätskontrolle und Automatisierung vorantreiben\n• Integration in bestehende Fertigungslinien planen\n\n',
      'IT & Software': '• AI-First Development Approach einführen\n• Entwicklertools und Code-Assistenten implementieren\n• Eigene AI-Produkte für Kunden entwickeln\n\n',
      'Einzelhandel': '• Personalisierung und Recommendation Engines\n• Inventory Management und Demand Forecasting\n• Customer Journey Optimization mit AI\n\n'
    };

    return industryAdvice[industry] || '• Branchenspezifische AI-Anwendungen identifizieren\n• Best Practices aus ähnlichen Industrien adaptieren\n\n';
  }

  private static getCompanySizeAdvice(companySize: string, level: string): string {
    if (companySize.includes('1-9') || companySize.includes('10-49')) {
      return '**Für Ihr Unternehmen empfehlen wir:**\n• Start mit kostengünstigen Cloud-AI-Services\n• Fokus auf Quick Wins und ROI-starke Anwendungen\n• Externe Expertise nutzen für schnelleren Fortschritt\n\n';
    }
    
    if (companySize.includes('50-249')) {
      return '**Für Ihr Unternehmen empfehlen wir:**\n• Aufbau einer dedizierten AI-Taskforce\n• Pilotprojekte in verschiedenen Abteilungen\n• Systematisches Change Management einführen\n\n';
    }
    
    if (companySize.includes('250-999')) {
      return '**Für Ihr Unternehmen empfehlen wir:**\n• Eigenes AI Center of Excellence etablieren\n• Unternehmensweite AI-Governance implementieren\n• Skalierbare AI-Infrastruktur aufbauen\n\n';
    }
    
    if (companySize.includes('1000+')) {
      return '**Für Ihr Unternehmen empfehlen wir:**\n• AI als strategischen Wettbewerbsvorteil positionieren\n• Eigene AI-Forschung und -Entwicklung\n• Thought Leadership in der Branche übernehmen\n\n';
    }
    
    return '';
  }
}
