// Test mit einer anderen Branche: Banking & Finance
const testAssessmentFinance = {
  "company_info": {
    "industry": "banking-finance",
    "companySize": "Großunternehmen (250-999 Mitarbeiter)",
    "location": "Schweiz"
  },
  "calculated_level": "advanced",
  "score": 62,
  "details": {
    "strategy_score": 18,
    "technology_score": 16,
    "data_score": 15,
    "governance_score": 13
  }
};

async function testFinanceUseCases() {
  try {
    console.log('Testing Dynamic Use Case Generation for Banking & Finance...');
    
    const response = await fetch('http://localhost:3002/api/use-case-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAssessmentFinance)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('\n=== BANKING & FINANCE USE CASES ===');
    console.log('Meta:', JSON.stringify(result.meta, null, 2));
    
    if (result.recommendations) {
      result.recommendations.forEach((rec, index) => {
        console.log(`\n--- Recommendation ${index + 1} ---`);
        console.log('Title:', rec.useCase.title);
        console.log('Description:', rec.useCase.description);
        console.log('Category:', rec.useCase.category);
        console.log('Complexity:', rec.useCase.complexity);
        console.log('Benefits:', rec.useCase.benefits?.slice(0, 2) || []);
        console.log('Next Steps:', rec.useCase.nextSteps?.slice(0, 2) || []);
      });
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testFinanceUseCases();
