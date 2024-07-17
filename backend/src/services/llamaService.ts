import path from 'path';
import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';

export class LlamaService {
  private session: LlamaChatSession;

  constructor() {
    const models = {
      codellama: 'codellama-13b.Q3_K_M.gguf',
    };
    const modelPath = path.join(process.cwd(), 'models', models.codellama);
    const model = new LlamaModel({ modelPath: modelPath });
    const context = new LlamaContext({ model });
    this.session = new LlamaChatSession({ context });
  }

  async getAiResponse(message: string): Promise<string> {
    return await this.session.prompt(message);
  }

  generateFinPrompt(stockData: StockData[], prompt: Prompt): string {
    let question = prompt.prompt;
    question = question.replace('{}', stockData[0].date);
    question = question.replace('{startDate}', stockData[0].date);
    question = question.replace('{endDate}', stockData[stockData.length - 1].date);
    return question;
  }
}