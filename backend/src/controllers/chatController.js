import { askGroq } from "../utils/groq.js";

export async function askQuestion(req, res) {
    const { question } = req.body;

    if (!question) return res.status(400).json({ error: "No question provided" });

    try {
        const answer = await askGroq(question);
        res.json({ answer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
