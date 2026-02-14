import readline from 'node:readline/promises';
import { graph } from './graph';


async function main() {
  const app = graph.compile();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const query = await rl.question('You: ');
    if (query === '/bye') break;

    console.log('\n🤔 Thinking...');
    const result = await app.invoke({
      messages: [{ role: 'user', content: query }],
    });

    console.log('='.repeat(80));
    console.log('Final Answer');
    console.log('='.repeat(80));

    const lastMessage = result.messages[result.messages.length - 1].content;

    console.log(JSON.parse(lastMessage as string).answer);
  }

  rl.close();
}

main();
