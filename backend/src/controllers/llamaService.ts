import express from 'express';
import path from 'path';
import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';

const llamaService = express.Router();

// LLM Settings Here:
const models = {
    codellama: 'codellama-13b.Q3_K_M.gguf',
}
const modelPath = path.join(process.cwd(), 'models', models.codellama);

const model = new LlamaModel({
    modelPath: modelPath
});
const context = new LlamaContext({ model });
const session = new LlamaChatSession({ context });

// POST /api/llm
llamaService.post('/', async (req, res) => {
    console.log("llamaService / POST /api/llm/ called");
    const userMessage = req.body.messages;
    console.log("User: " + userMessage);

    try {
        const aiResponse = await session.prompt(userMessage);
        console.log("AI: " + aiResponse);
        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Error processing chat:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default llamaService;
