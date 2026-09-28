// src/services/llamaService.ts
import fs from 'fs';
import path from 'path';
import type { LlamaChatSession } from 'node-llama-cpp';
import { PromptTemplate, StockData } from '../data/entities/finance';
import templates from '../prompts/analysisTemplates.json';
import { fillTemplate, formatStockData } from '../utils/dataToPrompt';
import { HttpError } from '../utils/httpError';

const DEFAULT_MODEL_FILE = 'codellama-13b.Q3_K_M.gguf';
const CONTEXT_SIZE = 4096;
const SYSTEM_PROMPT =
  'You are a helpful financial analyst. Answer concisely, base your analysis on the data provided, ' +
  "and say when you don't have enough information. Do not give personalized investment advice.";

/**
 * Runs a local .gguf model with node-llama-cpp. The library is an optional dependency and the
 * model is loaded asynchronously on first use, so the server (and the Claude routes) stay
 * responsive and run fine without either.
 */
class LlamaService {
  private session: LlamaChatSession | null = null;
  private loading: Promise<LlamaChatSession> | null = null;
  // The chat session is stateful and not safe for concurrent prompts, so requests are queued.
  private queue: Promise<unknown> = Promise.resolve();

  get modelPath(): string {
    return path.resolve(process.cwd(), 'models', process.env.LLM_MODEL || DEFAULT_MODEL_FILE);
  }

  get isLoaded(): boolean {
    return this.session !== null;
  }

  get isLoading(): boolean {
    return this.loading !== null && this.session === null;
  }

  private async loadSession(): Promise<LlamaChatSession> {
    if (!fs.existsSync(this.modelPath)) {
      throw new HttpError(
        503,
        `Local model not found at ${this.modelPath}. Download a .gguf model into backend/models or set LLM_MODEL.`,
      );
    }

    let llamaCpp: typeof import('node-llama-cpp');
    try {
      llamaCpp = await import('node-llama-cpp');
    } catch {
      throw new HttpError(503, 'node-llama-cpp is not installed. Run `npm install node-llama-cpp` in backend/.');
    }

    console.log(`Loading local model ${this.modelPath}...`);
    // Keep llama.cpp's verbose native logging out of the server output.
    const llama = await llamaCpp.getLlama({ logLevel: llamaCpp.LlamaLogLevel.error });
    const model = await llama.loadModel({ modelPath: this.modelPath });
    const context = await model.createContext({ contextSize: CONTEXT_SIZE });
    console.log('Local model loaded');

    return new llamaCpp.LlamaChatSession({ contextSequence: context.getSequence(), systemPrompt: SYSTEM_PROMPT });
  }

  private getSession(): Promise<LlamaChatSession> {
    if (this.session) return Promise.resolve(this.session);
    if (!this.loading) {
      this.loading = this.loadSession()
        .then((session) => (this.session = session))
        .finally(() => {
          this.loading = null;
        });
    }
    return this.loading;
  }

  getAiResponse(message: string): Promise<string> {
    const run = this.queue.then(async () => (await this.getSession()).prompt(message, { maxTokens: 1024 }));
    this.queue = run.catch(() => undefined);
    return run;
  }

  /** Starts a fresh conversation, discarding the chat history held by the session. */
  resetConversation(): void {
    this.session?.resetChatHistory();
  }

  getPromptTemplates(): PromptTemplate[] {
    return templates;
  }

  generateFinPrompt(
    ticker: string,
    stockData: StockData[],
    prompt: PromptTemplate,
    extraValues: Record<string, string> = {},
  ): string {
    const question = fillTemplate(prompt, {
      stock: ticker,
      startDate: stockData[0].date,
      endDate: stockData[stockData.length - 1].date,
      ...extraValues,
    });
    return `${question}\n\nUse the following daily price data:\n${formatStockData(ticker, stockData)}`;
  }
}

export default new LlamaService();
