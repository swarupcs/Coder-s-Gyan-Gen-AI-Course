import { ChatOpenAI } from '@langchain/openai';

export const llm = new ChatOpenAI({
  model: 'gpt-5-nano-2025-08-07',
});
