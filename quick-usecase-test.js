// Schneller Test mit GPT-4o-mini
const testData = {
  "company_info": {
    "industry": "healthcare", 
    "companySize": "Mittleres Unternehmen (50-249 Mitarbeiter)"
  },
  "calculated_level": "intermediate",
  "score": 45
};

async function quickTest() {
  console.log('Testing Use Cases with GPT-4o-mini...');
  const start = Date.now();
  
  try {
    const response = await fetch('http://localhost:3002/api/use-case-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const time = Date.now() - start;
    console.log(`Response received in ${time}ms`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`SUCCESS! Generated ${data.recommendations?.length || 0} use cases`);
      console.log('Generation Type:', data.meta?.generationType);
      if (data.meta?.processingTimeMs) {
        console.log('Processing Time:', data.meta.processingTimeMs + 'ms');
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

quickTest();
