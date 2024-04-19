var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// index.ts
import cors from "cors";
import "dotenv/config";
import express2 from "express";

// src/routes/chat.route.ts
import express from "express";

// src/controllers/chat.controller.ts
import { streamToResponse } from "ai";
import { OpenAI } from "llamaindex";

// src/controllers/engine/index.ts
import {
  ContextChatEngine,
  serviceContextFromDefaults,
  storageContextFromDefaults,
  VectorStoreIndex
} from "llamaindex";

// src/controllers/engine/constants.mjs
var STORAGE_CACHE_DIR = "./cache";
var CHUNK_SIZE = 512;
var CHUNK_OVERLAP = 20;

// src/controllers/engine/index.ts
function getDataSource(llm) {
  return __async(this, null, function* () {
    const serviceContext = serviceContextFromDefaults({
      llm,
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP
    });
    let storageContext = yield storageContextFromDefaults({
      persistDir: `${STORAGE_CACHE_DIR}`
    });
    const numberOfDocs = Object.keys(
      storageContext.docStore.toDict()
    ).length;
    if (numberOfDocs === 0) {
      throw new Error(
        `StorageContext is empty - call 'npm run generate' to generate the storage first`
      );
    }
    return yield VectorStoreIndex.init({
      storageContext,
      serviceContext
    });
  });
}
function createChatEngine(llm) {
  return __async(this, null, function* () {
    const index = yield getDataSource(llm);
    const retriever = index.asRetriever();
    retriever.similarityTopK = 5;
    return new ContextChatEngine({
      chatModel: llm,
      retriever
    });
  });
}

// src/controllers/llamaindex-stream.ts
import {
  createCallbacksTransformer,
  createStreamDataTransformer,
  trimStartOfStreamHelper
} from "ai";
function createParser(res) {
  const trimStartOfStream = trimStartOfStreamHelper();
  return new ReadableStream({
    pull(controller) {
      return __async(this, null, function* () {
        const { value, done } = yield res.next();
        if (done) {
          controller.close();
          return;
        }
        const text = trimStartOfStream(value != null ? value : "");
        if (text) {
          controller.enqueue(text);
        }
      });
    }
  });
}
function LlamaIndexStream(res, callbacks) {
  return createParser(res).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(
    createStreamDataTransformer(callbacks == null ? void 0 : callbacks.experimental_streamData)
  );
}

// src/controllers/chat.controller.ts
var chat = (req, res, next) => __async(void 0, null, function* () {
  try {
    const { messages } = JSON.parse(req.body);
    const lastMessage = messages.pop();
    if (!messages || !lastMessage || lastMessage.role !== "user") {
      return res.status(400).json({
        error: "messages are required in the request body and the last message must be from the user"
      });
    }
    const llm = new OpenAI({
      model: "gpt-3.5-turbo"
    });
    const chatEngine = yield createChatEngine(llm);
    const response = yield chatEngine.chat(lastMessage.content, messages, true);
    const stream = LlamaIndexStream(response);
    streamToResponse(stream, res);
  } catch (error) {
    console.error("[LlamaIndex]", error);
    return res.status(500).json({
      error: error.message
    });
  }
});

// src/routes/chat.route.ts
var llmRouter = express.Router();
llmRouter.route("/").post(chat);
var chat_route_default = llmRouter;

// index.ts
var app = express2();
var port = 9e3;
var env = process.env["NODE_ENV"];
var isDevelopment = !env || env === "development";
var prodCorsOrigin = process.env["PROD_CORS_ORIGIN"];
if (isDevelopment) {
  console.warn("Running in development mode - allowing CORS for all origins");
  app.use(cors());
} else if (prodCorsOrigin) {
  console.log(`Running in production mode - allowing CORS for domain: ${prodCorsOrigin}`);
  const corsOptions = {
    origin: prodCorsOrigin
    // Restrict to production domain
  };
  app.use(cors(corsOptions));
} else {
  console.warn("Production CORS origin not set, defaulting to no CORS.");
}
app.use(express2.text());
app.get("/", (req, res) => {
  res.send("LlamaIndex Express Server");
});
app.use("/api/chat", chat_route_default);
var server = app.listen(port, () => {
  console.log(`\u26A1\uFE0F[server]: Server is running at http://localhost:${port}`);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
