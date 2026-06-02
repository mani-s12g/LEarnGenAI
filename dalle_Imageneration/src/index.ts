import OpenAI from "openai"
import * as dotenv from "dotenv"
import { createReadStream, readFileSync, writeFileSync } from "node:fs"; // save response locally

dotenv.config();

const OPENAI_API_KEY = process.env.GEMINI_API_KEY;

const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

async function generateImage() {
    const response = await client.images.generate({
        model: 'gemini-2.5-flash-image',
        // model: 'dall-e-3',
        prompt: "A beautiful landscape with mountains and river",
        n: 1, // number of responses
        size: "1024x1024",
        quality: "standard",
        style: "natural"
    });
    // console.log(response.data[0].url)
    const imageUrl = response.data?.[0]?.b64_json;
    if(imageUrl) {
        writeFileSync('image.png', Buffer.from(imageUrl, 'base64'));
    }
    console.log(response)

}
generateImage();

async function textToSpeech() {
    const response = await client.audio.speech.create({
        model: "gemini-2.5-flash-audio-preview-09-2025",
        voice: "alloy",
        input: "hello mani",
        response_format: "mp3",
        speed: 1.0
    });
    
    console.log(response);
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync("output.mp3", buffer);
}

textToSpeech();


async function speechToText() {
    const response = await client.audio.transcriptions.create({
        model: "gemini-2.5-flash-audio-preview-09-2025",
        file: createReadStream("output.mp3"),
        language: "en",
    });    
    console.log(response);
}

speechToText();