// Quick OpenAI Test
require('dotenv').config({ path: '.env.local' });

async function testOpenAI() {
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');
  
  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 10000,
    });

    console.log('Testing OpenAI connection...');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "Hello" in JSON format: {"message": "Hello"}' }],
      max_tokens: 50,
    });

    console.log('SUCCESS! OpenAI Response:', response.choices[0]?.message?.content);
  } catch (error) {
    console.error('FAILED! OpenAI Error:', error.message);
    if (error.code) console.error('Error Code:', error.code);
    if (error.status) console.error('HTTP Status:', error.status);
  }
}

testOpenAI();
