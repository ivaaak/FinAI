# FinAI - React / Express / NodeLlamaCPP Financial App (get financial  predictions based on a LLM)
A Web App built with React as a Frontend and Express as a Backend. It uses [Node](https://github.com/withcatai/node-llama-cpp) [LlamaCPP](https://github.com/ggerganov/llama.cpp) as a way to run an LLM locally and get financial predictions based on data from different APIs. Data store: MongoDB. 

### [Frontend: React (Vite + Typescript)](https://github.com/ivaaak/FinAI/tree/main/frontend)

### [Backend-Local: Express + MongoDB + Node LLAMA CPP LLM](https://github.com/ivaaak/FinAI/tree/main/backend-local-model)

### [Backend-API: Express + Anthropic API / SDK](https://github.com/ivaaak/FinAI/tree/main/backend-api-model)

### Getting Started (Local):
You need to setup the LLM you want to be using in the backend. The LLM should be saved as a .gguf file in the `backend/models` folder.
- Validate LLM:  
`npx --no node-llama-cpp chat --model PATH-TO-MODEL-DIR` 
`npx --no node-llama-cpp chat --model c:/projects/finai/backend/models/codellama-13b.Q3_K_M.gguf`
- Or do a test request:
```
curl --location 'localhost:9000/api/llm' \
--header 'Content-Type: application/json' \
--data '{ "messages": "Hello there" }'
```
- Or call the express API endpoint  `localhost:9000/api/llm`  to see the result

Some examples for models and formats: [LLMTypeDefinitions.json](https://github.com/ivaaak/FinAI/blob/main/backend/src/LLMTypeDefinitions.json)

Then you can run the below commands from the FinAI (main) directory and start the project:
```cmd
npm i
npm start
```
This installs and starts both the FE and BE using the npm tool 'concurrently'. Or you can run the commands separately in the frontend / backend folders to have them running in separate instances/terminals.

### Getting Started (Anthropic API):

Create a .env.local file in the root directory:
```cmd
ANTHROPIC_API_KEY=your_api_key_here
```
Run the development server:
```cmd
npm i
npm start
```

### Built With:
-  [**✔**]  `React (Vite, Typescript)`
-  [**✔**]  `Express API`
- [**✔**]  `Node LlamaCPP`
-  [**✔**]  `TradingView API / Widgets`
-  [**✔**]  `Axios`
-  [**✔**]  `MongoDB`

### Features:
- `Free Chat / Text Inputs`
- `Analysis Prompts` - specific prompts for analyzing financial data
- `Price / Ticker Inputs` - a structured way of serving financial data to the LLM
- `Data Visualisation for Stocks / Crypto` - Charts / Diagrams / Tickers with live price updates from the TradingView API

#### Not implemented yet / In Progress:
- `Auth0` Auth and User Management
- `LLM Fine-Tuning` and general Model-related options

#### Based on the Node Llama CPP Runtime/Library:
https://github.com/withcatai/node-llama-cpp
