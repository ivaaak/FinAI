// src/env.ts
// Imported first by server.ts so environment variables are set before other modules read them.
// `.env.local` takes precedence over `.env`, and project-level files over the repo root.
import dotenv from 'dotenv';
import path from 'path';

for (const file of ['.env.local', '.env', '../.env.local', '../.env']) {
  dotenv.config({ path: path.resolve(process.cwd(), file) });
}
