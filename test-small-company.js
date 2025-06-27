// Test mit kleinem Unternehmen: IT & Software, Beginner Level
const testAssessmentSmall = {
  "company_info": {
    "industry": "it-software",
    "companySize": "Kleinunternehmen (10-49 Mitarbeiter)",
    "location": "Schweiz"
  },
  "calculated_level": "beginner",
  "score": 25,
  "details": {
    "strategy_score": 8,
    "technology_score": 6,
    "data_score": 7,
    "governance_score": 4
  }
};

async function testSmallCompanyUseCases() {
  try {
    console.log('Testing Dynamic Use Case Generation for Small IT Company...');
    
    const response = await fetch('http://localhost:3002/api/use-case-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAssessmentSmall)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('\n=== SMALL IT COMPANY USE CASES ===');
    console.log(`Score: ${testAssessmentSmall.score}/75 - Level: ${testAssessmentSmall.calculated_level}`);
    
    if (result.recommendations) {
      result.recommendations.forEach((rec, index) => {
        console.log(`\n--- ${index + 1}. ${rec.useCase.title} ---`);
        console.log('Complexity:', rec.useCase.complexity);
        console.log('Required Level:', rec.useCase.requiredMaturityLevel);
        console.log('Cost:', `${rec.useCase.estimatedCost.min}-${rec.useCase.estimatedCost.max} CHF`);
        console.log('ROI:', `${rec.useCase.estimatedROI.percentage}% in ${rec.useCase.estimatedROI.timeframe}`);
        console.log('Time to Implement:', rec.useCase.timeToImplement);
        console.log('Feasibility Score:', rec.feasibilityScore + '%');
        console.log('Benefits:', rec.useCase.benefits?.slice(0, 2).join(', '));
      });
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSmallCompanyUseCases();
