// src/controllers/OpenBBController.ts

import { Request, Response } from 'express';
import { OpenBBService } from '../services/openBBService';

export class OpenBBController {
  private openBBService: OpenBBService;

  constructor() {
    this.openBBService = new OpenBBService();
  }

  async query(req: Request, res: Response): Promise<void> {
    try {
      const { query, openbbTools, extraTools, verbose } = req.body;
      const result = await this.openBBService.queryOpenBB(query, { openbbTools, extraTools, verbose });
      res.json({ result });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  }

  async getStockPrice(req: Request, res: Response): Promise<void> {
    try {
      const { symbol } = req.params;
      const price = await this.openBBService.getStockPrice(symbol);
      res.json({ symbol, price });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the stock price.' });
    }
  }

  async getCompanyRevenue(req: Request, res: Response): Promise<void> {
    try {
      const { symbol } = req.params;
      const revenue = await this.openBBService.getCompanyRevenue(symbol);
      res.json({ symbol, revenue });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the company revenue.' });
    }
  }
}