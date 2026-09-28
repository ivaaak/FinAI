export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PromptTemplate {
  name: string;
  /** Space-separated placeholder names used in `prompt`, e.g. "stock startDate endDate" */
  placeholders: string;
  /** Template text with `{placeholder}` tokens */
  prompt: string;
}
