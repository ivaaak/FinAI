import { Request, Response } from 'express';
import { LlamaService } from '../services/llamaService';

export class LlamaController {
  private llamaService: LlamaService;

  constructor() {
    this.llamaService = new LlamaService();
  }

  async handleChatPrompt(req: Request, res: Response): Promise<void> {
    console.log("POST /api/llm/ or /api/llm/textPrompt called");
    const userMessage = req.body.messages;
    console.log("User: " + userMessage);

    try {
      const aiResponse = await this.llamaService.getAiResponse(userMessage);
      console.log("AI: " + aiResponse);
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async handleFinPrompt(req: Request, res: Response): Promise<void> {
    console.log("POST /api/llm/finPrompt called");
    const stockData: StockData[] = req.body.stockData;
    const prompt: Prompt = req.body.prompt;

    console.log("Stock Data: ", stockData);
    console.log("Prompt: ", prompt);

    try {
      const question = this.llamaService.generateFinPrompt(stockData, prompt);
      console.log("Generated Question: ", question);

      const aiResponse = await this.llamaService.getAiResponse(question);
      console.log("AI: " + aiResponse);
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}