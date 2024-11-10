import axios from 'axios';

export class OpenBBService {
  private openBBPAT: string;

  constructor() {
    this.openBBPAT = process.env.OPENBB_PAT || '';
  }

  async queryOpenBB(query: string, options?: {
    openbbTools?: string[],
    extraTools?: Function[],
    verbose?: boolean
  }): Promise<string> {
    // This is a mock implementation. In a real scenario, you'd call the OpenBB API.
    const response = await axios.post('https://api.openbb.co/query', {
      query,
      openbbTools: options?.openbbTools,
      extraTools: options?.extraTools,
      verbose: options?.verbose,
    }, {
      headers: {
        'Authorization': `Bearer ${this.openBBPAT}`
      }
    });

    return response.data.result;
  }

  async getStockPrice(symbol: string): Promise<number> {
    const query = `What is the current stock price of ${symbol}?`;
    const result = await this.queryOpenBB(query);
    // Parse the result to extract the stock price
    // This is a simplified example; you'd need to parse the actual response
    const price = parseFloat(result.match(/\$(\d+(\.\d+)?)/)?.[1] || '0');
    return price;
  }

  async getCompanyRevenue(symbol: string): Promise<number> {
    const query = `What is the most recent annual revenue of ${symbol}?`;
    const result = await this.queryOpenBB(query, { openbbTools: ['.equity.fundamental.income'] });
    // Parse the result to extract the revenue
    // This is a simplified example; you'd need to parse the actual response
    const revenue = parseFloat(result.match(/\$(\d+(\.\d+)?)/)?.[1] || '0');
    return revenue;
  }
}