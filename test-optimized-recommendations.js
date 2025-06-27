// Test für die neue optimierte AI Recommendations
const testData = {
  "company_info": {
    "industry": "healthcare", 
    "companySize": "Mittleres Unternehmen (50-249 Mitarbeiter)"
  },
  "calculated_level": "Digital AI Player",
  "score": 45
};

async function testOptimizedRecommendations() {
  console.log('Testing Optimized AI Recommendations...');
  const start = Date.now();
  
  try {
    const response = await fetch('http://localhost:3002/api/ai-recommendations-optimized', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: testData })
    });
    
    const time = Date.now() - start;
    console.log(`Response received in ${time}ms`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('SUCCESS!');
      console.log('Recommendation length:', data.recommendation?.length || 0, 'chars');
      console.log('Top Use Cases:', data.topUseCases?.length || 0);
      console.log('Processing Time:', data.meta?.processingTimeMs + 'ms');
      console.log('Generation Type:', data.meta?.generationType);
      
      console.log('\n=== RECOMMENDATION ===');
      console.log(data.recommendation);
      
      if (data.topUseCases) {
        console.log('\n=== TOP USE CASES ===');
        data.topUseCases.forEach((uc, i) => {
          console.log(`${i+1}. ${uc.useCase.title}`);
          console.log(`   Complexity: ${uc.useCase.complexity}`);
          console.log(`   Cost: ${uc.useCase.estimatedCost.min}-${uc.useCase.estimatedCost.max} CHF`);
        });
      }
    } else {
      console.log('Error Status:', response.status);
      const error = await response.text();
      console.log('Error:', error);
    }
  } catch (error) {
    const time = Date.now() - start;
    console.log(`FAILED after ${time}ms:`, error.message);
  }
}

testOptimizedRecommendations();
