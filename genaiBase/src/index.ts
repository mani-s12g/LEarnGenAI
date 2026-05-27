import dotenv from "dotenv"
import "dotenv/config";
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
dotenv.config()

import OpenAI from 'openai';
const OPENAI_API_KEY = process.env.GEMINI_API_KEY;

const client = new OpenAI({
  apiKey: OPENAI_API_KEY, // This is the default and can be omitted
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'gemini-2.5-flash',
    messages: [
        {role: "user", content: "Hello, how are you?"}
    ]
  });
  console.log(response.choices);
  console.log(response.choices[0]?.message?.content);
}

main();