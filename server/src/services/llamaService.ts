import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';

const chatService = express.Router();

const model = new LlamaModel({
    modelPath: path.join(__dirname, 'models', 'codellama-13b.Q3_K_M.gguf')
});
const context = new LlamaContext({ model });
const session = new LlamaChatSession({ context });

// POST /api/chat
chatService.post('/', async (req, res) => {
    console.log("ChatService / POST /api/chat/ called");
    const userMessage = req.body.message;
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


export default chatService;
