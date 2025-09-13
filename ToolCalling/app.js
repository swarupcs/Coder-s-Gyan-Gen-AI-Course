import Groq from 'groq-sdk';
import { tavily } from '@tavily/core';
import dotenv from 'dotenv';
dotenv.config();

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// console.log('process.env.GROQ_API_KEY', process.env.GROQ_API_KEY);

async function main() {
  const messages = [
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
  ];

  while (true) {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0,
      messages: messages,
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
                  description: 'The search query to perform search on',
                },
              },
              required: ['query'],
            },
          },
        },
      ],
      tool_choice: 'auto',
    });

    messages.push(completion.choices[0].message);

    const toolCalls = completion.choices[0].message.tool_calls;

    // console.log("toolCalls", toolCalls);

    if (!toolCalls) {
      console.log(`Assistant: ${completion.choices[0].message.content}`);
      break;
    }

    for (const tool of toolCalls) {
      // console.log('Tool call:', tool);
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;

      if (functionName === 'webSearch') {
        const toolResult = await webSearch(JSON.parse(functionParams));
        // console.log('Tool result:', toolResult);

        messages.push({
          tool_call_id: tool.id,
          role: 'tool',
          name: functionName,
          content: toolResult,
        });
      }

      const completions2 = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        messages: messages,
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
                    description: 'The search query to perform search on',
                  },
                },
                required: ['query'],
              },
            },
          },
        ],
        tool_choice: 'auto',
      });

      // console.log(JSON.stringify(completions2.choices[0].message, null, 2));
    }

    // console.log(JSON.stringify(completion.choices[0].message.content));
  }
}

main();

async function webSearch({ query }) {
  // Here we will do tavily api call

  // console.log('tool call with query:', query);

  const response = await tvly.search(query);

  // console.log(response);

  const finalResponse = response.results
    .map((result) => result.content)
    .join('\n\n');
  // console.log('response', finalResponse);
  return finalResponse;
  // return 'Iphone 16 was launched on September 12, 2024.';
}
