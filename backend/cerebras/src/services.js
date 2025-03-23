import Cerebras from '@cerebras/cerebras_cloud_sdk';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY, // Retrieve API key from .env
});

export async function getChatCompletion(userMessage) {
  try {
    const response = await client.chat.completions.create({
      messages: [{ role: 'user', content: userMessage }],
      model: 'llama3.1-8b',
    });

    return response?.choices[0]?.message?.content;
  } catch (error) {
    console.error('Error fetching completion:', error);
  }
}
