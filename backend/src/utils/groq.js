import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_KEY = process.env.GROQ_API_KEY;

export async function askGroq(prompt) {
    console.log("Utilisation de la clé Groq:", GROQ_KEY);

    const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_KEY}`
        },
        body: JSON.stringify({
            model: "llama3-70b-8192", // Vérifie que ce modèle est dispo chez Groq
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        })
    });

    const data = await res.json();
    console.log("Réponse brute Groq :", JSON.stringify(data, null, 2));
    return data.choices?.[0]?.message?.content ?? "No response from model";
}

