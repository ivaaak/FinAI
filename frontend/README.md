# FinAI Frontend

React 18 + Vite + TypeScript + Tailwind CSS.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm test           # typecheck + lint
```

## Structure

```
src/
  components/
    Header.tsx            market tabs + theme toggle
    market/               TradingView widgets (ticker tape, chart, news) and the watchlist
    chat/                 AI Analyst panel, composer (attachments), message rendering
    charts/FinanceChart   renders AI-generated chart data with Recharts
    ui/                   small shared primitives (Button, Card, Select)
  data/                   market symbol lists and analysis prompt templates
  hooks/                  useChat, useModels, useTheme, useLocalStorage
  services/api.ts         calls to the finance (Claude) and local LLM backends
```

## Backend

In development, Vite proxies `/api/*` to the backend at `http://localhost:3000` (see [`../backend`](../backend)).
Override the target with `API_TARGET`, or set `VITE_API_URL` when the API is served from another origin (see `.env.example`).
