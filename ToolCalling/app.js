import Groq from 'groq-sdk';

import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// console.log('process.env.GROQ_API_KEY', process.env.GROQ_API_KEY);

async function main() {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are a smart personal assistant who answers the asked questions.
        You have access to following tools:
        1. webSearch({query} : {query: string}) // Search the latest information and realtime data on the internet
        `,
      },
      {
        role: 'user',
        content: 'When was iphone 16 launched?',
      },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'webSearch',
          description:
            'Search the latest information and realtime data on the internet',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query to perform search om',
              },
            },
            required: ['query'],
          },
        },
      },
    ],
    tool_choice: 'auto',
  });

  const toolCalls = completion.choices[0].tool_calls;

  console.log("toolCalls", toolCalls);

  if(!toolCalls) {
    console.log(`Assistant: ${completion.choices[0].message.content}`);
    return;
  }


  for(const tool of toolCalls) {
    console.log('Tool call:', tool);
    const functionName = tool.function.name;
    const functionParams = tool.function.arguments;

    if(functionName === 'webSearch') {
      const toolResult = await webSearch((JSON.parse(functionParams)));
      console.log('Tool result:', toolResult);
  } 


  // console.log(JSON.stringify(completion.choices[0].message.content));
}
}

main();

async function webSearch({ query}) {
  // Here we will do tavily api call

  console.log("tool call with query:", query);

  return 'Iphone 16 was launched on September 12, 2024.';
}

 


