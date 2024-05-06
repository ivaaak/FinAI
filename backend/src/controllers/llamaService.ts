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

// POST /api/llm/textPrompt
llamaService.post('/textPrompt/', async (req, res) => {
    console.log("llamaService / POST /api/llm/textPrompt called");
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


// POST /api/llm/finPrompt
// The basic idea is: choose a prompt /analysis option/ and a stock with its data and generate a prompt from it
llamaService.post('/api/llm/finPrompt', async (req, res) => {
    console.log("llamaService / POST /api/llm/finPrompt called");
    const stockData: StockData[] = req.body.stockData;
    const prompt: Prompt = req.body.prompt;

    console.log("Stock Data: ", stockData);
    console.log("Prompt: ", prompt);

    try {
        // Generate a question based on the prompt and stock data
        let question = prompt.prompt;
        question = question.replace('{}', stockData[0].date); // date as a placeholder
        question = question.replace('{startDate}', stockData[0].date); // date as a placeholder
        question = question.replace('{endDate}', stockData[stockData.length - 1].date); // last date as the end date

        console.log("Generated Question: ", question);

        const aiResponse = await session.prompt(question);
        console.log("AI: " + aiResponse);
        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Error processing chat:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default llamaService;
