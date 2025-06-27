// Test Script für Dynamic Use Case Generation
const testAssessment = {
  "company_info": {
    "industry": "automotive",
    "companySize": "Mittleres Unternehmen (50-249 Mitarbeiter)",
    "location": "Schweiz"
  },
  "calculated_level": "intermediate",
  "score": 45,
  "details": {
    "strategy_score": 15,
    "technology_score": 12,
    "data_score": 10,
    "governance_score": 8
  }
};

async function testDynamicUseCases() {
  try {
    console.log('Testing Dynamic Use Case Generation...');
    console.log('Assessment:', JSON.stringify(testAssessment, null, 2));
    
    const response = await fetch('http://localhost:3002/api/use-case-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAssessment)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('\n=== DYNAMIC USE CASE RESULTS ===');
    console.log('Meta:', JSON.stringify(result.meta, null, 2));
    console.log('Total Recommendations:', result.recommendations?.length || 0);
    
    if (result.recommendations) {
      result.recommendations.forEach((rec, index) => {
        console.log(`\n--- Recommendation ${index + 1} ---`);
        console.log('Title:', rec.useCase.title);
        console.log('Category:', rec.useCase.category);
        console.log('Complexity:', rec.useCase.complexity);
        console.log('Feasibility Score:', rec.feasibilityScore);
        console.log('Priority Score:', rec.priorityScore);
        console.log('Cost Range:', `${rec.useCase.estimatedCost.min}-${rec.useCase.estimatedCost.max} ${rec.useCase.estimatedCost.currency}`);
        console.log('ROI:', `${rec.useCase.estimatedROI.percentage}% in ${rec.useCase.estimatedROI.timeframe}`);
      });
    }

  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      const errorText = await error.response.text();
      console.error('Response:', errorText);
    }
  }
}

testDynamicUseCases();
