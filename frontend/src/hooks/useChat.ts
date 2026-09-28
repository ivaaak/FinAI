import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, resetLocalConversation, sendFinanceMessage, sendLocalMessage } from '@/services/api';
import { createId } from '@/lib/utils';
import type { ChatMessage, PendingFile, Provider } from '@/types/chat';
import { useLocalStorage } from './useLocalStorage';

const MAX_STORED_MESSAGES = 100;

interface UseChatOptions {
  provider: Provider;
  model: string;
}

export function useChat({ provider, model }: UseChatOptions) {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('finai.chat.v1', []);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Cancel any in-flight request on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  const appendMessage = useCallback(
    (message: ChatMessage) => setMessages((prev) => [...prev, message].slice(-MAX_STORED_MESSAGES)),
    [setMessages],
  );

  const send = useCallback(
    async (text: string, pending?: PendingFile) => {
      const content = text.trim();
      if ((!content && !pending) || isLoading) return;

      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        content,
        createdAt: Date.now(),
        attachment: pending
          ? { name: pending.file.name, mediaType: pending.data.mediaType, size: pending.file.size }
          : undefined,
      };
      const history = [...messages, userMessage];
      appendMessage(userMessage);

      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);

      try {
        if (provider === 'claude') {
          const response = await sendFinanceMessage(
            { messages: history, model, fileData: pending?.data },
            controller.signal,
          );
          appendMessage({
            id: createId(),
            role: 'assistant',
            content: response.content,
            charts: response.charts,
            model: response.model,
            createdAt: Date.now(),
          });
        } else {
          const reply = await sendLocalMessage(content, controller.signal);
          appendMessage({
            id: createId(),
            role: 'assistant',
            content: reply,
            model: 'Local Llama',
            createdAt: Date.now(),
          });
        }
      } catch (error) {
        const aborted = error instanceof DOMException && error.name === 'AbortError';
        appendMessage({
          id: createId(),
          role: 'assistant',
          content: aborted
            ? 'Request cancelled.'
            : error instanceof ApiError || error instanceof Error
              ? error.message
              : 'Something went wrong.',
          error: true,
          createdAt: Date.now(),
        });
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setIsLoading(false);
      }
    },
    [appendMessage, isLoading, messages, model, provider],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    if (provider === 'local') {
      // The local model keeps its own conversation state; best-effort reset.
      resetLocalConversation().catch(() => undefined);
    }
  }, [provider, setMessages]);

  return { messages, isLoading, send, stop, clear };
}
