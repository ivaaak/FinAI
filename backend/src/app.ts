// src/app.ts
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import { config } from './config';
import routes from './routes';
import { HttpError } from './utils/httpError';

const app: Express = express();

const allowedOrigins = config.corsOrigin.split(',').map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins.includes('*') ? '*' : allowedOrigins }));
app.use(express.json({ limit: '25mb' }));
app.use('/api', routes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware - maps known errors to meaningful status codes.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // express.json() errors (malformed JSON, payload too large)
  if (err && typeof err === 'object' && 'type' in err) {
    const { type } = err as { type: string };
    if (type === 'entity.parse.failed') {
      res.status(400).json({ error: 'Malformed JSON body' });
      return;
    }
    if (type === 'entity.too.large') {
      res.status(413).json({ error: 'Request body is too large' });
      return;
    }
  }

  console.error('❌ Finance API error:', err);

  // Most specific first: all of these extend Anthropic.APIError.
  if (err instanceof Anthropic.AuthenticationError) {
    res.status(401).json({ error: 'Anthropic authentication failed. Check ANTHROPIC_API_KEY.' });
  } else if (err instanceof Anthropic.RateLimitError) {
    res.status(429).json({ error: 'Rate limited by the Anthropic API. Please retry shortly.' });
  } else if (err instanceof Anthropic.BadRequestError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof Anthropic.APIConnectionError) {
    res.status(502).json({ error: 'Could not reach the Anthropic API.' });
  } else if (err instanceof Anthropic.APIError) {
    res.status(err.status && err.status >= 400 ? err.status : 502).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default app;
