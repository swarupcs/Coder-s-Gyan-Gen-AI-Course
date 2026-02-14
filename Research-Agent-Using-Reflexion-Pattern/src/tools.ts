import { HumanMessage, type AIMessage } from '@langchain/core/messages';
import type { graphState, QuestionAnswer } from './state';
import { TavilySearch } from '@langchain/tavily';

const tavilySearch = new TavilySearch({ maxResults: 2 });

export async function searchExecutor(state: typeof graphState.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  const parsed = JSON.parse(lastMessage.content as string) as QuestionAnswer;

  const searchResult = await tavilySearch.batch(
    parsed.searchQueries.map((query) => ({ query })),
  );

  const cleanedResults = [];

  for (let i = 0; i < parsed.searchQueries.length; i++) {
    const query = parsed.searchQueries[i];
    const searchOutput = searchResult[i];

    // Access the results array directly from the search output
    const results = searchOutput?.results || [];

    // Extract only essential fields from each result
    for (const result of results) {
      cleanedResults.push({
        query: query,
        content: result.content || '',
        url: result.url || '',
      });
    }
  }

  return {
    messages: [
      new HumanMessage(JSON.stringify({ searchResults: cleanedResults })),
    ],
  };
}
