// src/config.ts
export interface ModelOption {
  id: string;
  label: string;
  description: string;
}

// Models the client may pick from. The first entry is the default.
export const MODELS: ModelOption[] = [
  {
    id: 'claude-opus-5',
    label: 'Claude Opus 5',
    description: 'Most capable - best for in-depth analysis',
  },
  {
    id: 'claude-sonnet-5',
    label: 'Claude Sonnet 5',
    description: 'Balanced speed and quality',
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    description: 'Fastest - good for quick questions',
  },
];

export const DEFAULT_MODEL = MODELS[0].id;

// Models that support server-side refusal fallbacks (`fallbacks: "default"`).
export const MODELS_WITH_FALLBACKS = new Set(['claude-opus-5']);

export const config = {
  port: Number(process.env.PORT) || 3000,
  // Comma-separated list of allowed origins, or "*" for any.
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  maxTokens: 16000,
  maxMessages: 100,
  // Base64 payload limit for attachments (~15MB decoded).
  maxFileBase64Length: 20 * 1024 * 1024,
};
