export interface AIUseCase {
  id: string;
  title: string;
  description: string;
  industry: string;
  category: 'automation' | 'analytics' | 'customer-experience' | 'operations' | 'innovation';
  complexity: 'low' | 'medium' | 'high';
  timeToImplement: string; // "2-4 weeks", "3-6 months", etc.
  requiredMaturityLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedCost: {
    min: number;
    max: number;
    currency: 'CHF' | 'EUR' | 'USD';
  };
  estimatedROI: {
    timeframe: string; // "12 months", "24 months"
    percentage: number;
    description: string;
  };
  prerequisites: string[];
  benefits: string[];
  risks: string[];
  technologies: string[];
  nextSteps: string[];
}

export interface UseCaseRecommendation {
  useCase: AIUseCase;
  feasibilityScore: number; // 0-100
  priorityScore: number; // 0-100
  reasoning: string;
  adaptedSteps: string[];
}
