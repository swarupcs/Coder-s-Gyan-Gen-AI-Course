import Groq from "groq-sdk";

import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// console.log('process.env.GROQ_API_KEY', process.env.GROQ_API_KEY);

async function main() {
    const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            { role: 'system', content: 'You are Jarvis, a smart personal assistant. Be always polite' },
            { role: 'user', content: 'Who are you?' },
        ],
    });

    // console.log("completions", completion);
    // console.log("completion.choices[0].message", completion.choices[0].message.content);
    console.log(completion.choices[0].message.content);
}

main();