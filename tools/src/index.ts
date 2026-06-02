import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();
const OPENAI_API_KEY = process.env.GEMINI_API_KEY;

const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

const context: OpenAI.ChatCompletionMessageParam[] = [
        { role: "system", content: "you are a helpful assistant"},
        { role: "user", content: "What is the current time in New York?"},
    ]

// AI cant retrun current time of any country or city when asked
// So Creating our own implementation to return current things..
// tools/function
function getCurrentTime() {
    return new Date().toLocaleString("en-US", {timeZone: "America/New_York"
    })
}

async function main() {
    const res = await client.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: context,
        tools: [
            {
                type: "function",
                function: {
                    name: "getCurrentTime",
                    description: "Get current time in New York"
                }
            }
        ],
        tool_choice: 'auto'
    });

    // step - 2: Decide to use/ call our tools
    const willInvokeTheTool = res?.choices[0]?.finish_reason === "tool_calls";
    const toolCall = res?.choices[0]?.message?.tool_calls?.[0];

    
    if (willInvokeTheTool && toolCall && toolCall.type === "function") {
        const toolName = toolCall.function.name;
        if (toolName === "getCurrentTime") {
            const time = getCurrentTime();
            context.push(res.choices[0].message!);
            context.push({
                role: "tool",
                content: time,
                tool_call_id: toolCall.id,
            });
        }
    }

    const secRes = await client.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: context,
    });
    console.log(secRes.choices?.[0]?.message?.content, "secondRes");
}

main();