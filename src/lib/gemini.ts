import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini Client
// We use a singleton pattern or just export the client
// Ideally this should be server-side only

const apiKey = process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
} else {
    console.warn("GEMINI_API_KEY is not set in environment variables. AI features will be disabled.");
}

export const getGeminiModel = (modelName: string = "gemini-pro") => {
    if (!genAI) {
        throw new Error("Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.");
    }
    return genAI.getGenerativeModel({ model: modelName });
};
