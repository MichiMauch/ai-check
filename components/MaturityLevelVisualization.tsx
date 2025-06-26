import React from 'react';
import { MaturityLevel, MATURITY_LEVELS } from '@/types/assessment';

interface MaturityLevelVisualizationProps {
  selectedLevel?: MaturityLevel;
  calculatedLevel?: MaturityLevel;
  selfAssessment?: MaturityLevel;
  onLevelSelect?: (level: MaturityLevel) => void;
  showSelection?: boolean;
  className?: string;
}

export default function MaturityLevelVisualization({
  selectedLevel,
  calculatedLevel,
  selfAssessment,
  onLevelSelect,
  showSelection = false,
  className = ""
}: MaturityLevelVisualizationProps) {
  
  const levelOrder: MaturityLevel[] = [
    'Digital AI Resister',
    'Digital AI Explorer', 
    'Digital AI Player',
    'Digital AI Transformer',
    'Digital AI Disrupter'
  ];

  const getStepColor = (level: MaturityLevel) => {
    const levelInfo = MATURITY_LEVELS.find(l => l.name === level);
    return levelInfo?.color || 'bg-gray-500';
  };

  const getStepIcon = (level: MaturityLevel) => {
    const levelInfo = MATURITY_LEVELS.find(l => l.name === level);
    return levelInfo?.icon || '🔹';
  };

  const isSelected = (level: MaturityLevel) => {
    return selectedLevel === level;
  };

  const isCalculated = (level: MaturityLevel) => {
    return calculatedLevel === level;
  };

  const isSelfAssessed = (level: MaturityLevel) => {
    return selfAssessment === level;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Legend for Results Page */}
      {!showSelection && (selfAssessment || calculatedLevel) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Legende:</h4>
          <div className="flex flex-wrap gap-4 text-xs">
            {selfAssessment && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <span className="text-gray-700">Ihre ursprüngliche Selbsteinschätzung</span>
              </div>
            )}
            {calculatedLevel && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <span className="text-gray-700">Berechneter Reifegrad (basierend auf Ihren Antworten)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile: Vertical Stack */}
      <div className="block md:hidden space-y-3">
        {levelOrder.map((level, index) => {
          const levelInfo = MATURITY_LEVELS.find(l => l.name === level);
          const isActive = isSelected(level) || isCalculated(level) || isSelfAssessed(level);
          
          return (
            <div
              key={level}
              onClick={() => showSelection && onLevelSelect && onLevelSelect(level)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${isActive 
                  ? 'border-primary-500 bg-primary-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${showSelection ? 'cursor-pointer' : ''}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl
                  ${getStepColor(level)}
                `}>
                  {getStepIcon(level)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {level}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {levelInfo?.description}
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    {levelInfo?.characteristics.slice(0, 2).map((char, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gray-400 mr-1">•</span>
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Multiple indicators */}
              <div className="absolute top-2 right-2 flex flex-col space-y-1">
                {/* Selection indicator */}
                {isSelected(level) && showSelection && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                
                {/* Self assessment indicator */}
                {isSelfAssessed(level) && !showSelection && (
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                )}
                
                {/* Calculated level indicator */}
                {isCalculated(level) && !showSelection && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Horizontal Flow */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connection Lines */}
          <div className="absolute top-8 left-16 right-16 h-0.5 bg-gray-300 z-0"></div>
          
          {/* Steps */}
          <div className="relative z-10 flex justify-between items-start">
            {levelOrder.map((level, index) => {
              const levelInfo = MATURITY_LEVELS.find(l => l.name === level);
              const isActive = isSelected(level) || isCalculated(level) || isSelfAssessed(level);
              
              return (
                <div
                  key={level}
                  onClick={() => showSelection && onLevelSelect && onLevelSelect(level)}
                  className={`
                    flex flex-col items-center w-1/5 px-2
                    ${showSelection ? 'cursor-pointer' : ''}
                  `}
                >
                  {/* Step Circle */}
                  <div className={`
                    relative w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl transition-all duration-200
                    ${getStepColor(level)}
                    ${isActive ? 'ring-4 ring-primary-300 scale-110' : ''}
                    ${showSelection && !isActive ? 'hover:scale-105' : ''}
                  `}>
                    {getStepIcon(level)}
                    
                    {/* Multiple indicators */}
                    <div className="absolute -top-2 -right-2 flex flex-col space-y-1">
                      {/* Selection indicator */}
                      {isSelected(level) && showSelection && (
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      
                      {/* Self assessment indicator */}
                      {isSelfAssessed(level) && !showSelection && (
                        <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <span className="text-white text-xs font-bold">1</span>
                        </div>
                      )}
                      
                      {/* Calculated level indicator */}
                      {isCalculated(level) && !showSelection && (
                        <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <span className="text-white text-xs font-bold">2</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <div className={`
                    mt-4 bg-white rounded-lg border-2 p-4 w-full transition-all duration-200
                    ${isActive 
                      ? 'border-primary-500 bg-primary-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}>
                    <h4 className="font-semibold text-gray-900 text-center mb-2">
                      {level}
                    </h4>
                    <p className="text-xs text-gray-600 text-center mb-3">
                      {levelInfo?.description}
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {levelInfo?.characteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gray-400 mr-1 flex-shrink-0">•</span>
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Legende - nur anzeigen wenn nicht showSelection */}
      {!showSelection && (calculatedLevel || selfAssessment) && (
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          {selfAssessment && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-gray-700">Ihre ursprüngliche Selbsteinschätzung</span>
            </div>
          )}
          {calculatedLevel && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <span className="text-gray-700">Berechneter Reifegrad</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
