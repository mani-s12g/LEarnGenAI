import OpenAI from "openai";
import * as dotenv from "dotenv";
import promptSync from "prompt-sync";
dotenv.config();
const OPENAI_API_KEY = process.env.GEMINI_API_KEY;
const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
const context = [
    { role: "system", content: 'You are a helpful assistant' },
    // { role: "user", content: 'Hello' },
];
async function chatCompletion() {
    const res = await client.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: context,
        max_tokens: 50
    });
    const resMessage = res?.choices[0]?.message?.content ?? "";
    context.push({
        role: "assistant",
        content: resMessage,
    });
    console.log("Assistant: ", resMessage);
}
async function main() {
    const input = promptSync({ sigint: true });
    while (true) {
        const userInput = input("User I/P: ");
        if (userInput.toLowerCase() === "exit") {
            console.log("Exiting the chat app. Goodbye!");
            break;
        }
        context.push({
            role: 'user',
            content: userInput
        });
        await chatCompletion();
        // const chatCompletion = await client.chat.completions.create({
        //     model: "gemini-2.5-flash",
        //     messages: [{ role: "user", content: userInput }],
        //     max_tokens: 50
        // });
        // console.log("chatCompletion:", chatCompletion?.choices[0]?.message.content);
    }
}
main();
//# sourceMappingURL=index.js.map