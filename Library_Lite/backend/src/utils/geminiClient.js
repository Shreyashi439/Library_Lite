// backend/src/utils/geminiClient.js
let gemini = null;

async function getGeminiClient() {
  if (!gemini) {
    const { GoogleGenAI } = await import("@google/genai"); // dynamic import for ESM-only SDK
    gemini = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
  }
  return gemini;
}

module.exports = { getGeminiClient };
