
## Getting Started

First, install the dependencies:
`npm install`

Second, run the development server:
`npm run dev`

### LLM Setup: 
The LLM should be a .gguf file in the backend/models folder


Validate LLM: 
`npx --no node-llama-cpp chat --model c:/projects/finai/backend/models/codellama-13b.Q3_K_M.gguf`

or do a test request:
```
curl --location 'localhost:9000/api/llm' \
--header 'Content-Type: application/json' \
--data '{ "messages": "Hello there" }'
```

Then call the express API endpoint `localhost:9000/api/llm` to see the result

You can start editing the API by modifying `src/controllers/llamaService.ts`

