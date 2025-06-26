export type MaturityLevel = 
  | 'Digital AI Resister'
  | 'Digital AI Explorer'
  | 'Digital AI Player'
  | 'Digital AI Transformer'
  | 'Digital AI Disrupter';

export type Industry = 
  | 'Automotive'
  | 'Banking & Finance'
  | 'Beratung & Consulting'
  | 'Bildung & Forschung'
  | 'Chemie & Pharma'
  | 'Einzelhandel'
  | 'Energie & Umwelt'
  | 'Gesundheitswesen'
  | 'IT & Software'
  | 'Logistik & Transport'
  | 'Maschinenbau'
  | 'Medien & Marketing'
  | 'Öffentliche Verwaltung'
  | 'Produktion & Fertigung'
  | 'Telekommunikation'
  | 'Tourismus & Gastronomie'
  | 'Versicherung'
  | 'Sonstige';

export type CompanySize = 
  | 'Kleinstunternehmen (1-9 Mitarbeiter)'
  | 'Kleinunternehmen (10-49 Mitarbeiter)'
  | 'Mittleres Unternehmen (50-249 Mitarbeiter)'
  | 'Großunternehmen (250-999 Mitarbeiter)'
  | 'Konzern (1000+ Mitarbeiter)';

export interface CompanyInfo {
  industry: Industry;
  companySize: CompanySize;
}

export interface AIProduct {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  pricing: string;
  timeline: string;
  targetMaturityLevels: MaturityLevel[];
  targetIndustries: Industry[];
  targetCompanySizes: CompanySize[];
}

export const AI_PRODUCTS: AIProduct[] = [
  {
    id: 'experience-day',
    name: 'AI Experience Day',
    subtitle: 'HANDS-ON AI WORKSHOP FOR TEAMS',
    description: 'Empower your team with practical AI knowledge. Our interactive workshop combines hands-on learning, experimentation, and strategic planning to unlock AI opportunities in your organization.',
    pricing: 'From CHF 1,000',
    timeline: '0.5 - 1 day',
    targetMaturityLevels: ['Digital AI Resister', 'Digital AI Explorer'],
    targetIndustries: ['Automotive', 'Banking & Finance', 'Beratung & Consulting', 'Bildung & Forschung', 'Chemie & Pharma', 'Einzelhandel', 'Energie & Umwelt', 'Gesundheitswesen', 'IT & Software', 'Logistik & Transport', 'Maschinenbau', 'Medien & Marketing', 'Öffentliche Verwaltung', 'Produktion & Fertigung', 'Telekommunikation', 'Tourismus & Gastronomie', 'Versicherung', 'Sonstige'],
    targetCompanySizes: ['Kleinstunternehmen (1-9 Mitarbeiter)', 'Kleinunternehmen (10-49 Mitarbeiter)', 'Mittleres Unternehmen (50-249 Mitarbeiter)']
  },
  {
    id: 'innovation-sprint',
    name: 'AI Innovation Sprint',
    subtitle: 'BUILT WITH AI, DELIVERED IN 5 DAYS',
    description: 'We use AI to accelerate development and embed intelligence into your MVP from day one. Your prototype isn\'t just functional—it\'s smart.',
    pricing: 'CHF 15,000',
    timeline: '5 days',
    targetMaturityLevels: ['Digital AI Explorer', 'Digital AI Player'],
    targetIndustries: ['IT & Software', 'Medien & Marketing', 'Beratung & Consulting', 'Banking & Finance', 'Einzelhandel'],
    targetCompanySizes: ['Kleinunternehmen (10-49 Mitarbeiter)', 'Mittleres Unternehmen (50-249 Mitarbeiter)', 'Großunternehmen (250-999 Mitarbeiter)']
  },
  {
    id: 'custom-chat-ui',
    name: 'Custom Chat UI',
    subtitle: 'ENTERPRISE RAG SOLUTIONS',
    description: 'Transform your knowledge into an AI assistant. We build RAG systems that understand your business and deliver accurate, contextual responses.',
    pricing: 'From CHF 25,000',
    timeline: '2-3 weeks',
    targetMaturityLevels: ['Digital AI Player', 'Digital AI Transformer'],
    targetIndustries: ['Banking & Finance', 'Beratung & Consulting', 'Gesundheitswesen', 'IT & Software', 'Öffentliche Verwaltung', 'Versicherung'],
    targetCompanySizes: ['Mittleres Unternehmen (50-249 Mitarbeiter)', 'Großunternehmen (250-999 Mitarbeiter)', 'Konzern (1000+ Mitarbeiter)']
  },
  {
    id: 'custom-ai-solutions',
    name: 'Custom AI Solutions',
    subtitle: 'INTELLIGENCE-FIRST DEVELOPMENT',
    description: 'We don\'t just add AI to your solution—we design with AI at the core. Every feature is enhanced by intelligence, creating exponential value.',
    pricing: 'Custom pricing',
    timeline: 'Flexible',
    targetMaturityLevels: ['Digital AI Transformer', 'Digital AI Disrupter'],
    targetIndustries: ['Automotive', 'Banking & Finance', 'Chemie & Pharma', 'Energie & Umwelt', 'Gesundheitswesen', 'IT & Software', 'Maschinenbau', 'Produktion & Fertigung', 'Telekommunikation'],
    targetCompanySizes: ['Großunternehmen (250-999 Mitarbeiter)', 'Konzern (1000+ Mitarbeiter)']
  }
];

export interface Question {
  id: number;
  level: MaturityLevel;
  statement: string;
}

export interface AssessmentAnswer {
  questionId: number;
  score: number; // 1-5
}

export interface AssessmentResult {
  company_info: CompanyInfo;
  self_assessment: MaturityLevel;
  calculated_level: MaturityLevel;
  score: number;
  level_description: string;
  delta: string;
  insight: string;
  next_steps: string;
}

export interface MaturityLevelInfo {
  name: MaturityLevel;
  description: string;
  color: string;
  icon: string;
  characteristics: string[];
}

export const MATURITY_LEVELS: MaturityLevelInfo[] = [
  {
    name: 'Digital AI Resister',
    description: 'Keine oder sehr begrenzte AI-Nutzung im Unternehmen',
    color: 'bg-red-500',
    icon: '🚫',
    characteristics: [
      'Keine AI-Strategie vorhanden',
      'Kaum Verständnis für AI-Potentiale',
      'Unsicherheit gegenüber neuen Technologien'
    ]
  },
  {
    name: 'Digital AI Explorer',
    description: 'Erste Schritte und Experimente mit AI-Technologien',
    color: 'bg-orange-500',
    icon: '🔍',
    characteristics: [
      'Erste AI-Guidelines entwickelt',
      'Einzelne Mitarbeiter experimentieren',
      'Bewusstsein für AI-Potentiale entsteht'
    ]
  },
  {
    name: 'Digital AI Player',
    description: 'Strukturierte Herangehensweise an AI-Implementierung',
    color: 'bg-yellow-500',
    icon: '⚡',
    characteristics: [
      'AI-Roadmap vorhanden',
      'Gezielte Kompetenzentwicklung',
      'Erste produktive AI-Anwendungen'
    ]
  },
  {
    name: 'Digital AI Transformer',
    description: 'AI als strategisches Kernelement des Unternehmens',
    color: 'bg-blue-500',
    icon: '🚀',
    characteristics: [
      'AI zentral in der Unternehmensstrategie',
      'Eigenes AI-Team etabliert',
      'Ethik und Datenqualität im Fokus'
    ]
  },
  {
    name: 'Digital AI Disrupter',
    description: 'AI treibt Geschäftsmodellinnovation und Marktführerschaft',
    color: 'bg-green-500',
    icon: '🌟',
    characteristics: [
      'AI gestaltet Geschäftsmodelle',
      'Hohe Automatisierung erreicht',
      'Ethische AI-Prinzipien verankert'
    ]
  }
];

export const ASSESSMENT_QUESTIONS: Question[] = [
  // Digital AI Resister (3 Fragen) - Grundlegende AI-Awareness
  {
    id: 1,
    level: 'Digital AI Resister',
    statement: 'Unser Unternehmen beschäftigt sich aktiv mit den Möglichkeiten von Künstlicher Intelligenz.'
  },
  {
    id: 2,
    level: 'Digital AI Resister',
    statement: 'Mitarbeiter in unserem Unternehmen haben grundlegendes Wissen über AI-Technologien.'
  },
  {
    id: 3,
    level: 'Digital AI Resister',
    statement: 'Das Management sieht AI als relevante Technologie für unser Unternehmen.'
  },
  
  // Digital AI Explorer (3 Fragen)
  {
    id: 4,
    level: 'Digital AI Explorer',
    statement: 'Wir haben erste Guidelines für den Umgang mit AI-Tools entwickelt.'
  },
  {
    id: 5,
    level: 'Digital AI Explorer',
    statement: 'Einzelne Mitarbeiter experimentieren bereits mit AI-Tools wie ChatGPT oder ähnlichen.'
  },
  {
    id: 6,
    level: 'Digital AI Explorer',
    statement: 'Das Management zeigt Interesse an den Möglichkeiten von Künstlicher Intelligenz.'
  },
  
  // Digital AI Player (3 Fragen)
  {
    id: 7,
    level: 'Digital AI Player',
    statement: 'Wir haben eine konkrete Roadmap für die Implementierung von AI-Lösungen erstellt.'
  },
  {
    id: 8,
    level: 'Digital AI Player',
    statement: 'Unser Unternehmen investiert gezielt in die Kompetenzentwicklung im Bereich AI.'
  },
  {
    id: 9,
    level: 'Digital AI Player',
    statement: 'Wir setzen AI bereits in spezifischen Anwendungsbereichen produktiv ein.'
  },
  
  // Digital AI Transformer (3 Fragen)
  {
    id: 10,
    level: 'Digital AI Transformer',
    statement: 'AI ist ein zentraler Bestandteil unserer Unternehmensstrategie geworden.'
  },
  {
    id: 11,
    level: 'Digital AI Transformer',
    statement: 'Wir haben ein eigenes internes AI-Team oder AI-Experten etabliert.'
  },
  {
    id: 12,
    level: 'Digital AI Transformer',
    statement: 'Ethik und Datenqualität stehen im Zentrum unserer AI-Initiativen.'
  },
  
  // Digital AI Disrupter (3 Fragen)
  {
    id: 13,
    level: 'Digital AI Disrupter',
    statement: 'AI-Technologien gestalten aktiv unsere Geschäftsmodelle und Wertschöpfungsketten.'
  },
  {
    id: 14,
    level: 'Digital AI Disrupter',
    statement: 'Wir haben einen hohen Grad an Automatisierung durch AI-Systeme erreicht.'
  },
  {
    id: 15,
    level: 'Digital AI Disrupter',
    statement: 'Ethische AI-Prinzipien sind fest in unserer Unternehmenskultur verankert.'
  }
];
