// src/services/anthropicService.ts
import Anthropic from '@anthropic-ai/sdk';
import { config, MODELS_WITH_FALLBACKS } from '../config';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt';
import { ChatMessage, FileData } from '../types/message';
import { tools } from '../utils/chartTools';
import { HttpError } from '../utils/httpError';

const IMAGE_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
type ImageMediaType = (typeof IMAGE_MEDIA_TYPES)[number];

const TEXT_MEDIA_TYPES = ['application/json', 'application/csv', 'application/xml'];

const isImageMediaType = (mediaType: string): mediaType is ImageMediaType =>
  (IMAGE_MEDIA_TYPES as readonly string[]).includes(mediaType);

const isTextFile = ({ isText, mediaType }: FileData): boolean =>
  !!isText || mediaType.startsWith('text/') || TEXT_MEDIA_TYPES.includes(mediaType);

class AnthropicService {
  private client: Anthropic | null = null;

  // Created lazily so the server can start (and report a clear error) without an API key.
  private getClient(): Anthropic {
    if (!this.client) {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new HttpError(
          500,
          'ANTHROPIC_API_KEY is not set. Add it to backend/.env.local and restart the server.',
        );
      }
      this.client = new Anthropic();
    }
    return this.client;
  }

  /**
   * Converts the chat history into Anthropic message params, attaching the
   * optional file to the latest user message.
   */
  buildMessages(messages: ChatMessage[], fileData?: FileData): Anthropic.Beta.BetaMessageParam[] {
    const anthropicMessages: Anthropic.Beta.BetaMessageParam[] = messages
      // Assistant turns that only rendered a chart can be empty; the API rejects empty text.
      .filter((msg) => msg.role === 'user' || msg.content.trim())
      .map((msg) => ({ role: msg.role, content: msg.content }));

    if (fileData) {
      const last = anthropicMessages[anthropicMessages.length - 1];
      const question = typeof last.content === 'string' ? last.content : '';
      last.content = [
        this.buildFileBlock(fileData),
        { type: 'text', text: question.trim() || 'Please analyze the attached file.' },
      ];
    }

    return anthropicMessages;
  }

  private buildFileBlock(fileData: FileData): Anthropic.Beta.BetaContentBlockParam {
    const { base64, mediaType, fileName } = fileData;
    const title = fileName || 'attachment';

    if (isImageMediaType(mediaType)) {
      return { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } };
    }

    if (mediaType === 'application/pdf') {
      return {
        type: 'document',
        title,
        source: { type: 'base64', media_type: 'application/pdf', data: base64 },
      };
    }

    if (isTextFile(fileData)) {
      return {
        type: 'document',
        title,
        source: {
          type: 'text',
          media_type: 'text/plain',
          data: Buffer.from(base64, 'base64').toString('utf-8'),
        },
      };
    }

    throw new HttpError(
      415,
      `Unsupported file type "${mediaType}". Attach an image, PDF, CSV, JSON or text file.`,
    );
  }

  async createChatCompletion(messages: Anthropic.Beta.BetaMessageParam[], model: string) {
    const supportsFallbacks = MODELS_WITH_FALLBACKS.has(model);

    return this.getClient().beta.messages.create({
      model,
      max_tokens: config.maxTokens,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      tools,
      tool_choice: { type: 'auto' },
      messages,
      // On a safety-classifier refusal, retry server-side on Anthropic's recommended fallback model.
      ...(supportsFallbacks && {
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default' as const,
      }),
    });
  }
}

export default new AnthropicService();
