// src/utils/validation.ts
import { config, DEFAULT_MODEL, MODELS } from '../config';
import { ChatMessage, FileData, FinanceRequest } from '../types/message';
import { HttpError } from './httpError';

const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

export const isValidBase64 = (str: string): boolean =>
  str.length % 4 === 0 && BASE64_PATTERN.test(str);

const isChatMessage = (value: unknown): value is ChatMessage => {
  if (!value || typeof value !== 'object') return false;
  const { role, content } = value as Record<string, unknown>;
  return (role === 'user' || role === 'assistant') && typeof content === 'string';
};

const validateFileData = (fileData: unknown): FileData => {
  if (!fileData || typeof fileData !== 'object') {
    throw new HttpError(400, 'fileData must be an object');
  }
  const { base64, mediaType, isText, fileName } = fileData as Record<string, unknown>;

  if (typeof base64 !== 'string' || !base64) {
    throw new HttpError(400, 'fileData.base64 is required');
  }
  if (base64.length > config.maxFileBase64Length) {
    throw new HttpError(413, 'Attached file is too large');
  }
  if (!isValidBase64(base64)) {
    throw new HttpError(400, 'fileData.base64 is not valid base64');
  }
  if (typeof mediaType !== 'string' || !mediaType) {
    throw new HttpError(400, 'fileData.mediaType is required');
  }

  return {
    base64,
    mediaType,
    isText: isText === true,
    fileName: typeof fileName === 'string' ? fileName : undefined,
  };
};

/**
 * Validates and normalizes the request body. Throws an HttpError (400) on invalid input.
 */
export const validateRequest = (body: unknown): Required<Omit<FinanceRequest, 'fileData'>> &
  Pick<FinanceRequest, 'fileData'> => {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Request body must be a JSON object');
  }
  const { messages, model, fileData } = body as Record<string, unknown>;

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new HttpError(400, 'messages must be a non-empty array');
  }
  if (messages.length > config.maxMessages) {
    throw new HttpError(400, `messages cannot contain more than ${config.maxMessages} items`);
  }
  if (!messages.every(isChatMessage)) {
    throw new HttpError(400, 'Each message needs a role ("user" | "assistant") and string content');
  }
  if (messages[messages.length - 1].role !== 'user') {
    throw new HttpError(400, 'The last message must be from the user');
  }
  if (!messages[messages.length - 1].content.trim() && !fileData) {
    throw new HttpError(400, 'The last message cannot be empty');
  }

  const resolvedModel = model === undefined || model === '' ? DEFAULT_MODEL : model;
  if (typeof resolvedModel !== 'string' || !MODELS.some((m) => m.id === resolvedModel)) {
    throw new HttpError(
      400,
      `Unsupported model. Choose one of: ${MODELS.map((m) => m.id).join(', ')}`,
    );
  }

  return {
    messages,
    model: resolvedModel,
    fileData: fileData === undefined || fileData === null ? undefined : validateFileData(fileData),
  };
};
