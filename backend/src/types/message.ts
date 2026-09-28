// src/types/message.ts
import type { ChartData } from './chart';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface FileData {
  base64: string;
  mediaType: string;
  isText?: boolean;
  fileName?: string;
}

export interface FinanceRequest {
  messages: ChatMessage[];
  model?: string;
  fileData?: FileData;
}

export interface FinanceResponse {
  content: string;
  charts: ChartData[];
  model: string;
  stopReason: string | null;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}
