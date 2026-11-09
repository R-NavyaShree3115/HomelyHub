import { Groq } from "groq-sdk/client.js";

let groq;

const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        const error = new Error("AI service is not configured");
        error.code = "AI_PROVIDER_NOT_CONFIGURED";
        throw error;
    }

    if (!groq) {
        groq = new Groq({ apiKey });
    }

    return groq;
};

export default getGroqClient;