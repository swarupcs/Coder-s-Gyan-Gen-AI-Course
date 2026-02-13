import readline from 'node:readline/promises';
import { HumanMessage } from '@langchain/core/messages';
import { graph } from './graph';


async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const app = graph.compile();

  while (true) {
    const query = await rl.question('What you want me to write about?\n');

    if (query === '/bye') break;

    const result = await app.invoke({
      messages: [new HumanMessage(query)],
    });

    console.log(result.messages[result.messages.length - 1].content);
  }

  rl.close();
}

main();
