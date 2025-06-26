export type MaturityLevel = 
  | 'Digital AI Resister'
  | 'Digital AI Explorer'
  | 'Digital AI Player'
  | 'Digital AI Transformer'
  | 'Digital AI Disrupter';

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
