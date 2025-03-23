import Cerebras from '@cerebras/cerebras_cloud_sdk';

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY, // Defaults to the environment variable
});

async function main() {
    // example function
    const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: 'Why is fast inference important?' }],
        model: 'llama3.1-8b',
    });

    console.log(chatCompletion?.choices[0]?.message);
}

main();
