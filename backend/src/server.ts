// src/server.ts
import './env';
import app from './app';
import { config } from './config';
import { connectToDatabase } from './data/database';

app.listen(config.port, () => {
  console.log(`FinAI API is running on http://localhost:${config.port}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY is not set - /api/finance requests will fail.');
  }
});

// MongoDB is only needed for /api/employees, so connect in the background without blocking startup.
if (process.env.ATLAS_URI) {
  connectToDatabase(process.env.ATLAS_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error: Error) =>
      console.warn(`Could not connect to MongoDB - /api/employees is unavailable (${error.message})`),
    );
}
