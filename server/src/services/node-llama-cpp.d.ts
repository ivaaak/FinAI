// node-llama-cpp.d.ts
declare module 'node-llama-cpp' {
    export class LlamaModel {
        constructor(options: { modelPath: string });
    }

    export class LlamaContext {
        constructor(options: { model: LlamaModel });
    }

    export class LlamaChatSession {
        constructor(options: { context: LlamaContext });
        prompt(message: string): Promise<string>;
    }
}
