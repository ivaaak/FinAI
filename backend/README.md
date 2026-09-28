# FinAI Backend

A single Express API (port 3000) serving:

- **`/api/finance`**: the Claude-powered analyst. It sends the chat to Claude with a `generate_graph_data` tool and returns the answer plus normalized chart data.
- **`/api/llm`**: an optional local model run with [node-llama-cpp](https://github.com/withcatai/node-llama-cpp).
- `/api/employees` (sample MongoDB CRUD) and `/api/openbb` (OpenBB helpers).

```bash
npm install
cp .env.example .env.local   # then set ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000 (watch mode)
npm run build && npm start   # production
npm test                     # typecheck + lint
```

Environment is read from `.env.local` / `.env` in this folder, then the repo root. See [`.env.example`](.env.example) for all variables (`ANTHROPIC_API_KEY`, `PORT`, `CORS_ORIGIN`, `LLM_MODEL`, `ATLAS_URI`, `OPENBB_PAT`).

Everything except Claude is optional. The server starts without a local model, without `node-llama-cpp` installed, and without MongoDB; those routes return a 503 explaining what's missing. `GET /api/health` reports what's available.

## Claude: `/api/finance`

- `GET /api/finance/models`: available models and the default (Claude Opus 5)
- `POST /api/finance`
  ```jsonc
  {
    "messages": [{ "role": "user", "content": "Chart AAPL's revenue by segment" }],
    "model": "claude-opus-5",              // optional
    "fileData": {                          // optional, attached to the last message
      "base64": "...", "mediaType": "text/csv", "fileName": "data.csv", "isText": true
    }
  }
  ```
  Response: `{ content, charts: ChartData[], model, stopReason, usage }`.
  Supported attachments: images (PNG/JPEG/GIF/WebP), PDF, and text (CSV, JSON, TXT, Markdown).

With Claude Opus 5, requests opt into server-side refusal fallbacks (`fallbacks: "default"`), so a request declined by a safety classifier is retried on Anthropic's recommended fallback model instead of failing.

## Local model: `/api/llm`

Put a `.gguf` model in `backend/models/` (examples in [docs/LLMTypeDefinitions.json](docs/LLMTypeDefinitions.json)) and set `LLM_MODEL` if it isn't `codellama-13b.Q3_K_M.gguf`. `node-llama-cpp` is an optional dependency: `npm install` tries to install it, and a failure there doesn't break the rest of the API. The model loads on the first request, which can take a minute.

```bash
npx --no node-llama-cpp chat --model ./models/codellama-13b.Q3_K_M.gguf   # validate the model
curl localhost:3000/api/llm -H 'Content-Type: application/json' -d '{ "messages": "Hello there" }'
```

- `POST /api/llm`: `{ "messages": "..." }` → `{ "response": "..." }`
- `POST /api/llm/finPrompt`: fills an analysis template with OHLCV data (sample in [samples/mockTickerData.json](samples/mockTickerData.json)):
  ```json
  { "ticker": "AAPL", "prompt": "Volume Analysis", "stockData": [{ "date": "2023-04-01", "open": 150, "high": 152.5, "low": 148, "close": 151, "volume": 1000000 }] }
  ```
  `prompt` is a template name from [`src/prompts/analysisTemplates.json`](src/prompts/analysisTemplates.json) or a `{ name, placeholders, prompt }` object. Templates use the placeholders `{stock}`, `{stock2}`, `{startDate}` and `{endDate}`. Pass any extra values in `values`.
- `GET /api/llm/prompts`, `GET /api/llm/status`, `POST /api/llm/reset`

## Errors

Every route returns errors as `{ error }` with a meaningful status: 400 for validation, 401 for a bad API key, 413 for a payload that's too large, 415 for an unsupported file, 429 when rate limited, 502 when the upstream is unavailable, and 503 when an optional feature isn't set up.

## Docker

```bash
docker build -t finai-api .
docker run -e ANTHROPIC_API_KEY=... -e CORS_ORIGIN=* -p 3000:3000 finai-api
```

The image leaves out `node-llama-cpp` to stay small (see the `Dockerfile` to include it).
