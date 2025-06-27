import type { AIUseCase } from '@/types/use-case';

// Branchenspezifische AI Use Cases Datenbank
export const AI_USE_CASES: AIUseCase[] = [
  // Banking & Finance
  {
    id: 'banking-fraud-detection',
    title: 'Betrugserkennung in Echtzeit',
    description: 'KI-basierte Analyse von Transaktionsmustern zur sofortigen Erkennung verdächtiger Aktivitäten',
    industry: 'banking-finance',
    category: 'analytics',
    complexity: 'medium',
    timeToImplement: '3-6 Monate',
    requiredMaturityLevel: 'intermediate',
    estimatedCost: { min: 50000, max: 200000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '12 Monate',
      percentage: 300,
      description: 'Reduzierung von Betrugsschäden um 70-80%'
    },
    prerequisites: [
      'Historische Transaktionsdaten',
      'API-Integration zu Kernsystemen',
      'Compliance-Freigabe für ML-Modelle'
    ],
    benefits: [
      'Drastische Reduzierung von Betrugsschäden',
      'Verbesserte Kundenerfahrung durch weniger False Positives',
      'Automatisierte 24/7 Überwachung'
    ],
    risks: [
      'Datenschutz und Compliance Herausforderungen',
      'Initial hohe False-Positive Rate',
      'Abhängigkeit von Datenqualität'
    ],
    technologies: ['Machine Learning', 'Real-time Analytics', 'API Integration'],
    nextSteps: [
      'Datenaudit durchführen',
      'POC mit historischen Daten starten',
      'Compliance-Team einbeziehen'
    ]
  },
  {
    id: 'banking-chatbot',
    title: 'Intelligenter Kundenservice-Chatbot',
    description: 'AI-Chatbot für 24/7 Kundenbetreuung mit Verständnis für Finanzprodukte',
    industry: 'banking-finance',
    category: 'customer-experience',
    complexity: 'low',
    timeToImplement: '6-12 Wochen',
    requiredMaturityLevel: 'beginner',
    estimatedCost: { min: 15000, max: 50000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '6 Monate',
      percentage: 200,
      description: 'Reduzierung der Service-Kosten um 40%'
    },
    prerequisites: [
      'FAQ-Datenbank',
      'Website/App Integration',
      'Grundlegende NLP-Kenntnisse'
    ],
    benefits: [
      '24/7 Verfügbarkeit',
      'Sofortige Antworten auf Standardfragen',
      'Entlastung des Support-Teams'
    ],
    risks: [
      'Mögliche Fehlinterpretationen',
      'Kundenfrustration bei komplexen Anfragen',
      'Wartungsaufwand für Updates'
    ],
    technologies: ['NLP', 'Chatbot Framework', 'API Integration'],
    nextSteps: [
      'FAQ-Analyse durchführen',
      'Chatbot-Plattform evaluieren',
      'Pilot mit kleiner Nutzergruppe'
    ]
  },

  // IT & Software
  {
    id: 'it-code-review',
    title: 'Automatisierte Code-Review und Qualitätssicherung',
    description: 'KI-gestützte Code-Analyse für Bugs, Security Issues und Best Practices',
    industry: 'it-software',
    category: 'automation',
    complexity: 'medium',
    timeToImplement: '4-8 Wochen',
    requiredMaturityLevel: 'intermediate',
    estimatedCost: { min: 20000, max: 80000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '12 Monate',
      percentage: 250,
      description: 'Reduzierung von Bugs um 60%, 30% weniger Code-Review Zeit'
    },
    prerequisites: [
      'Git Repository Zugang',
      'CI/CD Pipeline vorhanden',
      'Development Team Buy-in'
    ],
    benefits: [
      'Frühe Erkennung von Sicherheitslücken',
      'Konsistente Code-Qualität',
      'Reduzierte Review-Zeit'
    ],
    risks: [
      'False Positives bei Regeln',
      'Widerstand von Entwicklern',
      'Integration in bestehende Workflows'
    ],
    technologies: ['Static Code Analysis', 'ML Models', 'CI/CD Integration'],
    nextSteps: [
      'Code-Audit durchführen',
      'Tool-Evaluation (SonarQube, CodeClimate)',
      'Pilot-Integration in einem Projekt'
    ]
  },

  // Healthcare
  {
    id: 'healthcare-appointment',
    title: 'Intelligente Terminplanung und -optimierung',
    description: 'KI-basierte Vorhersage von No-Shows und optimale Terminverteilung',
    industry: 'healthcare',
    category: 'operations',
    complexity: 'medium',
    timeToImplement: '2-4 Monate',
    requiredMaturityLevel: 'intermediate',
    estimatedCost: { min: 30000, max: 100000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '12 Monate',
      percentage: 180,
      description: 'Reduzierung von No-Shows um 25%, bessere Auslastung'
    },
    prerequisites: [
      'Historische Termindaten',
      'Patientenverwaltungssystem Integration',
      'Datenschutz-Compliance'
    ],
    benefits: [
      'Optimierte Auslastung',
      'Reduzierte No-Show Rate',
      'Bessere Patientenerfahrung'
    ],
    risks: [
      'Datenschutz-Herausforderungen',
      'Komplexe Integration',
      'Akzeptanz bei Personal'
    ],
    technologies: ['Predictive Analytics', 'Calendar APIs', 'ML Models'],
    nextSteps: [
      'Datenanalyse der No-Show Patterns',
      'Datenschutz-Assessment',
      'Pilot mit einer Abteilung'
    ]
  },

  // Automotive
  {
    id: 'automotive-predictive-maintenance',
    title: 'Vorausschauende Wartung für Fahrzeugflotten',
    description: 'Predictive Maintenance basierend auf Sensor-Daten und Nutzungsmustern',
    industry: 'automotive',
    category: 'operations',
    complexity: 'high',
    timeToImplement: '6-12 Monate',
    requiredMaturityLevel: 'advanced',
    estimatedCost: { min: 100000, max: 500000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '18 Monate',
      percentage: 220,
      description: 'Reduzierung ungeplanter Ausfälle um 50%'
    },
    prerequisites: [
      'IoT-Sensoren in Fahrzeugen',
      'Datensammlung-Infrastruktur',
      'Wartungshistorie'
    ],
    benefits: [
      'Reduzierte Ausfallzeiten',
      'Optimierte Wartungskosten',
      'Verbesserte Fahrzeugsicherheit'
    ],
    risks: [
      'Hohe Initialinvestition',
      'Komplexe Datenintegration',
      'Abhängigkeit von Sensorqualität'
    ],
    technologies: ['IoT', 'Time Series Analysis', 'Edge Computing'],
    nextSteps: [
      'Sensor-Audit durchführen',
      'Datenarchitektur planen',
      'Pilot mit kleiner Fahrzeuggruppe'
    ]
  },

  // Retail
  {
    id: 'retail-inventory-optimization',
    title: 'KI-gesteuerte Lagerbestandsoptimierung',
    description: 'Automatische Bestandsvorhersage und Nachbestellungsoptimierung',
    industry: 'retail',
    category: 'operations',
    complexity: 'medium',
    timeToImplement: '3-6 Monate',
    requiredMaturityLevel: 'intermediate',
    estimatedCost: { min: 40000, max: 150000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '12 Monate',
      percentage: 280,
      description: 'Reduzierung der Lagerkosten um 20%, weniger Out-of-Stock'
    },
    prerequisites: [
      'Verkaufshistorie',
      'Inventory Management System',
      'Lieferantendaten'
    ],
    benefits: [
      'Optimierte Lagerbestände',
      'Reduzierte Out-of-Stock Situationen',
      'Automatisierte Nachbestellungen'
    ],
    risks: [
      'Saisonale Schwankungen schwer vorhersagbar',
      'Abhängigkeit von Datenqualität',
      'Integration in bestehende Systeme'
    ],
    technologies: ['Demand Forecasting', 'Optimization Algorithms', 'ERP Integration'],
    nextSteps: [
      'Verkaufsdaten analysieren',
      'ABC-Analyse der Produkte',
      'Pilot mit High-Runner Produkten'
    ]
  },

  // Manufacturing
  {
    id: 'manufacturing-quality-control',
    title: 'Automatisierte Qualitätskontrolle mit Computer Vision',
    description: 'KI-basierte visuelle Inspektion zur Fehlererkennung in der Produktion',
    industry: 'manufacturing',
    category: 'automation',
    complexity: 'high',
    timeToImplement: '4-8 Monate',
    requiredMaturityLevel: 'advanced',
    estimatedCost: { min: 80000, max: 300000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '12 Monate',
      percentage: 200,
      description: 'Reduzierung der Fehlerrate um 80%, weniger manuelle Kontrollen'
    },
    prerequisites: [
      'Hochauflösende Kameras',
      'Referenz-Bilder für Training',
      'Integration in Produktionslinie'
    ],
    benefits: [
      'Konsistente Qualitätskontrolle',
      'Frühe Fehlererkennung',
      'Reduzierte Ausschussrate'
    ],
    risks: [
      'Komplexe Lichtverhältnisse',
      'Hohe Hardwarekosten',
      'Training für verschiedene Produktvarianten'
    ],
    technologies: ['Computer Vision', 'Deep Learning', 'Edge Computing'],
    nextSteps: [
      'Machbarkeitsstudie durchführen',
      'Referenzbilder sammeln',
      'Hardware-Setup planen'
    ]
  },

  // Consulting
  {
    id: 'consulting-knowledge-management',
    title: 'AI-gestützte Wissensdatenbank',
    description: 'Intelligente Suche und Empfehlungen für interne Dokumente und Best Practices',
    industry: 'consulting',
    category: 'analytics',
    complexity: 'medium',
    timeToImplement: '2-4 Monate',
    requiredMaturityLevel: 'intermediate',
    estimatedCost: { min: 30000, max: 120000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '12 Monate',
      percentage: 180,
      description: 'Reduzierung der Recherche-Zeit um 60%'
    },
    prerequisites: [
      'Dokumenten-Repository',
      'Strukturierte Wissensbasis',
      'Change Management für neue Tools'
    ],
    benefits: [
      'Schnellere Projektbearbeitung',
      'Konsistente Qualität bei Empfehlungen',
      'Bessere Wissensverteilung im Team'
    ],
    risks: [
      'Datenqualität entscheidend',
      'Akzeptanz bei Beratern',
      'Kontinuierliche Pflege nötig'
    ],
    technologies: ['NLP', 'Vector Search', 'Knowledge Graphs'],
    nextSteps: [
      'Dokumenten-Audit durchführen',
      'Pilotprojekt mit einem Bereich',
      'User Training planen'
    ]
  },

  // Education
  {
    id: 'education-adaptive-learning',
    title: 'Adaptive Lernplattform',
    description: 'Personalisierte Lernpfade basierend auf individuellem Fortschritt und Lerntyp',
    industry: 'education',
    category: 'customer-experience',
    complexity: 'high',
    timeToImplement: '6-12 Monate',
    requiredMaturityLevel: 'advanced',
    estimatedCost: { min: 80000, max: 300000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '18 Monate',
      percentage: 150,
      description: 'Verbesserung der Lernerfolge um 40%'
    },
    prerequisites: [
      'Learning Management System',
      'Lernfortschritt-Daten',
      'Pädagogisches Konzept'
    ],
    benefits: [
      'Individualisierte Lernwege',
      'Höhere Erfolgsquoten',
      'Effizienter Ressourceneinsatz'
    ],
    risks: [
      'Komplexe Implementierung',
      'Datenschutz-Anforderungen',
      'Akzeptanz bei Lehrenden'
    ],
    technologies: ['Machine Learning', 'Learning Analytics', 'Recommendation Systems'],
    nextSteps: [
      'Pädagogisches Framework definieren',
      'Datenstrategie entwickeln',
      'Pilotprogramm mit kleiner Gruppe'
    ]
  },

  // Energy
  {
    id: 'energy-smart-grid-optimization',
    title: 'Smart Grid Energieoptimierung',
    description: 'KI-basierte Vorhersage und Optimierung von Energieverbrauch und -erzeugung',
    industry: 'energy',
    category: 'operations',
    complexity: 'high',
    timeToImplement: '8-18 Monate',
    requiredMaturityLevel: 'advanced',
    estimatedCost: { min: 200000, max: 800000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '24 Monate',
      percentage: 200,
      description: 'Energieeffizienz-Steigerung um 25%'
    },
    prerequisites: [
      'Smart Meter Infrastructure',
      'Historische Verbrauchsdaten',
      'Integration zu bestehenden Systemen'
    ],
    benefits: [
      'Optimierte Energieverteilung',
      'Reduzierte Ausfallzeiten',
      'Nachhaltigkeitsverbesserung'
    ],
    risks: [
      'Hohe Komplexität',
      'Regulatorische Anforderungen',
      'Kritische Infrastruktur'
    ],
    technologies: ['IoT', 'Predictive Analytics', 'Real-time Processing'],
    nextSteps: [
      'Infrastruktur-Assessment',
      'Regulatorische Klärung',
      'Machbarkeitsstudie'
    ]
  },

  // Insurance
  {
    id: 'insurance-claims-automation',
    title: 'Automatisierte Schadenbearbeitung',
    description: 'KI-gestützte Prüfung und Bearbeitung von Versicherungsschäden',
    industry: 'insurance',
    category: 'automation',
    complexity: 'medium',
    timeToImplement: '4-8 Monate',
    requiredMaturityLevel: 'intermediate',
    estimatedCost: { min: 60000, max: 250000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '12 Monate',
      percentage: 300,
      description: 'Bearbeitungszeit um 70% reduziert'
    },
    prerequisites: [
      'Digitale Schadensmeldungen',
      'Historische Schadensdaten',
      'Compliance-Framework'
    ],
    benefits: [
      'Schnellere Schadenbearbeitung',
      'Konsistente Bewertungen',
      'Kosteneinsparungen'
    ],
    risks: [
      'Komplexe Fälle benötigen manuellen Review',
      'Kundenerfahrung bei Fehlern',
      'Regulatorische Compliance'
    ],
    technologies: ['Document Processing', 'Computer Vision', 'Decision Trees'],
    nextSteps: [
      'Schadentypen analysieren',
      'Automatisierungsgrad definieren',
      'Pilot mit einfachen Schäden'
    ]
  },

  // Media
  {
    id: 'media-content-personalization',
    title: 'Personalisierte Content-Empfehlungen',
    description: 'KI-basierte Personalisierung von Inhalten für bessere User Experience',
    industry: 'media',
    category: 'customer-experience',
    complexity: 'medium',
    timeToImplement: '3-6 Monate',
    requiredMaturityLevel: 'intermediate',
    estimatedCost: { min: 40000, max: 150000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '9 Monate',
      percentage: 250,
      description: 'User Engagement um 45% gesteigert'
    },
    prerequisites: [
      'User Tracking System',
      'Content Management System',
      'Ausreichend User-Daten'
    ],
    benefits: [
      'Höhere User Engagement',
      'Längere Verweildauer',
      'Bessere Monetarisierung'
    ],
    risks: [
      'Datenschutz-Anforderungen',
      'Filter Bubble Effekte',
      'Content-Qualität wichtig'
    ],
    technologies: ['Recommendation Systems', 'Collaborative Filtering', 'Analytics'],
    nextSteps: [
      'User Journey analysieren',
      'A/B Testing Framework setup',
      'Content-Tagging optimieren'
    ]
  },

  // Public/Government
  {
    id: 'public-citizen-service-bot',
    title: 'Bürgerservice-Chatbot',
    description: 'Intelligenter Chatbot für häufige Bürgeranfragen und Formularhilfe',
    industry: 'public',
    category: 'customer-experience',
    complexity: 'low',
    timeToImplement: '3-6 Monate',
    requiredMaturityLevel: 'beginner',
    estimatedCost: { min: 25000, max: 80000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '12 Monate',
      percentage: 180,
      description: 'Entlastung der Hotline um 50%'
    },
    prerequisites: [
      'FAQ-Katalog',
      'Website Integration',
      'Mehrsprachigkeit'
    ],
    benefits: [
      '24/7 Verfügbarkeit',
      'Schnellere Antworten',
      'Entlastung der Mitarbeiter'
    ],
    risks: [
      'Komplexe Anfragen überfordern Bot',
      'Mehrsprachigkeit herausfordernd',
      'Barrierefreiheit beachten'
    ],
    technologies: ['NLP', 'Chatbot Platform', 'Multi-language Support'],
    nextSteps: [
      'Häufige Anfragen analysieren',
      'Mehrsprachiges Framework wählen',
      'Pilotprojekt mit einer Abteilung'
    ]
  },

  // Tourism
  {
    id: 'tourism-demand-forecasting',
    title: 'Tourismus-Nachfrage Vorhersage',
    description: 'KI-gestützte Vorhersage von Buchungsverhalten und Nachfrage-Peaks',
    industry: 'tourism',
    category: 'analytics',
    complexity: 'medium',
    timeToImplement: '4-8 Monate',
    requiredMaturityLevel: 'intermediate',
    estimatedCost: { min: 45000, max: 180000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '12 Monate',
      percentage: 220,
      description: 'Optimierte Auslastung und Preisgestaltung'
    },
    prerequisites: [
      'Historische Buchungsdaten',
      'Externe Datenquellen (Wetter, Events)',
      'Revenue Management System'
    ],
    benefits: [
      'Bessere Kapazitätsplanung',
      'Optimierte Preisgestaltung',
      'Reduzierte Überkapazitäten'
    ],
    risks: [
      'Saisonale Schwankungen',
      'Externe Faktoren schwer vorhersagbar',
      'Abhängigkeit von Datenqualität'
    ],
    technologies: ['Time Series Forecasting', 'External Data Integration', 'Demand Modeling'],
    nextSteps: [
      'Datenquellen identifizieren',
      'Forecast-Modell entwickeln',
      'Integration in Buchungssystem'
    ]
  },

  // General/Other - Fallback für alle Branchen
  {
    id: 'general-process-automation',
    title: 'Intelligente Prozessautomatisierung',
    description: 'RPA kombiniert mit KI für die Automatisierung repetitiver Geschäftsprozesse',
    industry: 'other',
    category: 'automation',
    complexity: 'low',
    timeToImplement: '2-4 Monate',
    requiredMaturityLevel: 'beginner',
    estimatedCost: { min: 20000, max: 80000, currency: 'CHF' },
    estimatedROI: {
      timeframe: '6 Monate',
      percentage: 200,
      description: 'Zeitersparnis von 30-50% bei repetitiven Aufgaben'
    },
    prerequisites: [
      'Dokumentierte Prozesse',
      'Standardisierte Arbeitsabläufe',
      'Management Buy-in'
    ],
    benefits: [
      'Reduzierte manuelle Arbeit',
      'Weniger Fehler',
      'Mitarbeiter fokussieren auf wertvollere Aufgaben'
    ],
    risks: [
      'Widerstand gegen Veränderungen',
      'Über-Automatisierung vermeiden',
      'Wartung der Automatisierungen'
    ],
    technologies: ['RPA', 'OCR', 'Workflow Automation'],
    nextSteps: [
      'Prozess-Mapping durchführen',
      'Automatisierungskandidaten identifizieren',
      'Pilot mit einem einfachen Prozess'
    ]
  }
];

// Hilfsfunktionen
export function getUseCasesByIndustry(industryId: string): AIUseCase[] {
  return AI_USE_CASES.filter(useCase => useCase.industry === industryId);
}

export function getUseCasesByComplexity(complexity: AIUseCase['complexity']): AIUseCase[] {
  return AI_USE_CASES.filter(useCase => useCase.complexity === complexity);
}

export function getUseCasesByMaturityLevel(level: AIUseCase['requiredMaturityLevel']): AIUseCase[] {
  return AI_USE_CASES.filter(useCase => useCase.requiredMaturityLevel === level);
}
