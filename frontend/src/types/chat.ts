import type { ChartData } from './chart';

export type Provider = 'claude' | 'local';

export interface ChatAttachment {
  name: string;
  mediaType: string;
  size: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  charts?: ChartData[];
  attachment?: ChatAttachment;
  /** Model or provider that produced an assistant message */
  model?: string;
  /** Set on assistant messages that represent a failed request */
  error?: boolean;
}

export interface FileData {
  base64: string;
  mediaType: string;
  fileName: string;
  isText: boolean;
}

export interface PendingFile {
  file: File;
  data: FileData;
}

export interface ModelOption {
  id: string;
  label: string;
  description: string;
}

export interface FinanceResponse {
  content: string;
  charts: ChartData[];
  model: string;
  stopReason: string | null;
  usage: { inputTokens: number; outputTokens: number };
}
