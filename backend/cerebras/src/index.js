import { getChatCompletion } from 'services.js';

async function runTest() {
  const response = await getChatCompletion('What is deep learning?');
  console.log('Cerebras API Response:', response);
}

runTest();
