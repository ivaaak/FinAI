
## Getting Started

First, install the dependencies:

```
npm install
```

Second, run the development server:

```
npm run dev
```

Then call the express API endpoint `/api/llm` to see the result:

```
curl --location 'localhost:9000/api/llm' \
--header 'Content-Type: application/json' \
--data '{ "messages": [{ "role": "user", "content": "Hello" }] }'
```

You can start editing the API by modifying `src/controllers/llamaService.ts`. The endpoint auto-updates as you save the file.

### LLM Setup: 
The LLM should be a .gguf file in the backend/models folder
