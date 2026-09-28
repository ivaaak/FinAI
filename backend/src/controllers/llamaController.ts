// src/controllers/llamaController.ts
import { NextFunction, Request, Response } from 'express';
import { PromptTemplate, StockData } from '../data/entities/finance';
import llamaService from '../services/llamaService';
import { HttpError } from '../utils/httpError';

const isStockData = (row: unknown): row is StockData => {
  if (!row || typeof row !== 'object') return false;
  const r = row as Record<string, unknown>;
  return (
    typeof r.date === 'string' && ['open', 'high', 'low', 'close', 'volume'].every((key) => typeof r[key] === 'number')
  );
};

const resolveTemplate = (prompt: unknown): PromptTemplate | undefined => {
  if (typeof prompt === 'string') {
    return llamaService.getPromptTemplates().find((t) => t.name === prompt);
  }
  if (prompt && typeof prompt === 'object' && typeof (prompt as PromptTemplate).prompt === 'string') {
    return prompt as PromptTemplate;
  }
  return undefined;
};

class LlamaController {
  async handleChatPrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userMessage: unknown = req.body?.messages;
      if (typeof userMessage !== 'string' || !userMessage.trim()) {
        throw new HttpError(400, 'messages must be a non-empty string');
      }
      res.json({ response: await llamaService.getAiResponse(userMessage) });
    } catch (error) {
      next(error);
    }
  }

  async handleFinPrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ticker, stockData, prompt, values } = req.body ?? {};
      if (typeof ticker !== 'string' || !ticker) {
        throw new HttpError(400, 'ticker is required');
      }
      if (!Array.isArray(stockData) || stockData.length === 0 || !stockData.every(isStockData)) {
        throw new HttpError(400, 'stockData must be a non-empty array of { date, open, high, low, close, volume }');
      }
      const template = resolveTemplate(prompt);
      if (!template) {
        throw new HttpError(400, 'prompt must be a template name or a { name, placeholders, prompt } object');
      }

      const question = llamaService.generateFinPrompt(ticker, stockData, template, values ?? {});
      res.json({ response: await llamaService.getAiResponse(question) });
    } catch (error) {
      next(error);
    }
  }

  getPrompts(_req: Request, res: Response): void {
    res.json(llamaService.getPromptTemplates());
  }

  status(_req: Request, res: Response): void {
    res.json({ modelPath: llamaService.modelPath, loaded: llamaService.isLoaded, loading: llamaService.isLoading });
  }

  reset(_req: Request, res: Response): void {
    llamaService.resetConversation();
    res.status(204).send();
  }
}

export default new LlamaController();
