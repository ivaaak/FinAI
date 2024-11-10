// src/app.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import routes from './routes';

const app: Express = express();

app.use(express.json({ limit: "50mb" }));
app.use("/api", routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;