# FinAI - Markets Dashboard with an AI Financial Analyst

A React dashboard with live TradingView charts, a ticker tape, per-symbol news, and an **AI Analyst** chat. The analyst can answer questions, analyze uploaded files (CSV, PDF statements, JSON, chart screenshots) and draw interactive charts. You can pick its provider in the UI:

- **Claude API**: the Anthropic SDK, with a chart-generation tool rendered in the UI, or
- **Local Llama**: a `.gguf` model running on your machine via [node-llama-cpp](https://github.com/withcatai/node-llama-cpp).

| Folder | Stack | Port |
| --- | --- | --- |
| [`frontend`](frontend) | React 18, Vite, TypeScript, Tailwind CSS, Recharts, TradingView widgets | 5173 |
| [`backend`](backend) | Express, `@anthropic-ai/sdk`, node-llama-cpp (optional), MongoDB (optional) | 3000 |

One backend serves both providers: `/api/finance` for Claude and `/api/llm` for the local model. In development, Vite proxies `/api/*` to it, so no CORS setup is needed.

## Getting started

1. Create `backend/.env.local` (see [`backend/.env.example`](backend/.env.example)):
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```
2. Install and run the backend + frontend from the repo root:
   ```bash
   npm run setup
   npm start
   ```
3. Open http://localhost:5173.

### Optional: local model

1. Download a `.gguf` model into `backend/models/` (see [LLMTypeDefinitions.json](backend/docs/LLMTypeDefinitions.json) for examples). Set `LLM_MODEL` in `backend/.env.local` if it isn't `codellama-13b.Q3_K_M.gguf`.
2. Validate it:
   ```bash
   npx --no node-llama-cpp chat --model backend/models/codellama-13b.Q3_K_M.gguf
   ```
3. In the AI Analyst panel, switch **Provider** to *Local Llama*. The model loads on the first message, which can take a minute.

## Scripts (repo root)

| Script | What it does |
| --- | --- |
| `npm run setup` | Install dependencies for the root, backend and frontend |
| `npm start` | Backend + frontend in watch mode |
| `npm run build` | Production builds |
| `npm test` | Typecheck and lint both projects |

## Features

- **Markets**: stocks, indexes, forex and crypto, with a filterable watchlist, TradingView advanced chart (1H/1D/1W/1M), ticker tape and symbol news.
- **AI Analyst**: suggested analysis prompts for the selected symbol, an "Analyze" shortcut, Markdown answers, file attachments (drag & drop), cancel/stop, and conversation history saved in the browser.
- **AI-generated charts**: bar, multi-bar, line, area, stacked area and pie charts, each with a data-table view.
- **Model choice**: Claude Opus 5 (default), Sonnet 5 or Haiku 4.5, or a local Llama model.
- **Light and dark themes**.

#### Not implemented yet / in progress
- `Auth0` auth and user management
- LLM fine-tuning and model-related options for the local model
- Live price data passed to the model (the analyst currently only knows what's in the conversation or attached files)
