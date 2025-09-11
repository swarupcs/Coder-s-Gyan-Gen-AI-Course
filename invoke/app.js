import Groq from 'groq-sdk';

import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// console.log('process.env.GROQ_API_KEY', process.env.GROQ_API_KEY);

async function main() {
  const completion = await groq.chat.completions.create({
    temperature: 1,
    // top_p: 0.2,
    // stop: "ga", // Negative
    // max_completion_tokens: 1000,
    // max_tokens: '',
    response_format: {type: 'json_object'},

    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an interview grader assistant. Your task is to generate candidate evaluation
          score. Output must be following JSON structure:
          {

          'confidence": number (1r10 scale),
          "accuracy": number (1-10 scale),
          "pass": boolean (true or false)
          }

          The response must:
          1. Include ALL fields shown above

          2. Use only the exact field names shown
          3. Follow the exact data types specified
          4. Contain ONLY the JSON object and nothing else `,
      },
      {
        role: 'user',
        content: ` Q: What does = do in JavaScript?
                    A: It checks strict equality-both value and type must match.  
                    Q: How do you create a promise that resolves after 1 second?
                    A: const p = new Promise(r => setTimeout(r, 1000));
                    Q: What is hoisting?
                    A: JavaScript moves declarations (but.not initializations) to the top of their scope before code runs.
                    Q: Why use let instead of var?
                    A: tet is block-scoped, avoiding the function-scope quirks and re-declaration issues of var.,`
   
      },
    ],
  });

  // console.log("completions", completion);
  // console.log("completion.choices[0].message", completion.choices[0].message.content);
  console.log(completion.choices[0].message.content);
}

main();
