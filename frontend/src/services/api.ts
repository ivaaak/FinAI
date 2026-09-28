import type { ChatMessage, FileData, FinanceResponse, ModelOption } from '@/types/chat';

// Empty by default: requests go to relative /api/* URLs, which the Vite dev proxy forwards.
const API_URL = import.meta.env.VITE_API_URL ?? '';

export const FALLBACK_MODELS: ModelOption[] = [
  { id: 'claude-opus-5', label: 'Claude Opus 5', description: 'Most capable - best for in-depth analysis' },
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', description: 'Balanced speed and quality' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', description: 'Fastest - good for quick questions' },
];

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(url: string, init: RequestInit, serviceName: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers },
      cache: 'no-store',
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(`Could not reach the ${serviceName}. Is it running?`);
  }

  const body = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    // The Vite proxy returns a bare 5xx when the target backend is down.
    const message =
      body?.error ??
      (res.status >= 500 ? `The ${serviceName} is unavailable (HTTP ${res.status}). Is it running?` : res.statusText);
    throw new ApiError(message, res.status);
  }
  return body as T;
}

/** Converts the stored chat into the plain-text history the backend expects. */
const toApiMessages = (messages: ChatMessage[]) =>
  messages
    .filter((m) => !m.error)
    .map((m) => {
      let content = m.content;
      if (m.attachment) content = `[Attached file: ${m.attachment.name}]\n${content}`;
      if (m.charts?.length) {
        content += `\n\n[Charts shown to the user: ${m.charts.map((c) => c.config.title).join('; ')}]`;
      }
      return { role: m.role, content };
    });

export function sendFinanceMessage(
  params: { messages: ChatMessage[]; model: string; fileData?: FileData },
  signal?: AbortSignal,
): Promise<FinanceResponse> {
  return request<FinanceResponse>(
    `${API_URL}/api/finance`,
    {
      method: 'POST',
      body: JSON.stringify({
        messages: toApiMessages(params.messages),
        model: params.model,
        fileData: params.fileData,
      }),
      signal,
    },
    'FinAI backend',
  );
}

export async function fetchModels(): Promise<{ models: ModelOption[]; defaultModel: string }> {
  return request(`${API_URL}/api/finance/models`, { method: 'GET' }, 'FinAI backend');
}

export async function sendLocalMessage(message: string, signal?: AbortSignal): Promise<string> {
  const data = await request<{ response: string }>(
    `${API_URL}/api/llm`,
    { method: 'POST', body: JSON.stringify({ messages: message }), signal },
    'FinAI backend',
  );
  return data.response;
}

export async function resetLocalConversation(): Promise<void> {
  await request(`${API_URL}/api/llm/reset`, { method: 'POST' }, 'FinAI backend');
}
