// src/services/anthropicService.ts
import Anthropic from '@anthropic-ai/sdk';
import { Message, FileData } from '../types/message';
import { tools } from '../utils/chartTools';

class AnthropicService {
    private client: Anthropic;

    constructor() {
        this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY!,
        });
    }

    async processMessages(messages: Message[], fileData?: FileData): Promise<Message[]> {
        let anthropicMessages = messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));

        if (fileData) {
            await this.processFileData(anthropicMessages, fileData);
        }

        return anthropicMessages;
    }

    private async processFileData(messages: Message[], fileData: FileData): Promise<void> {
        const { base64, mediaType, isText, fileName } = fileData;

        if (!base64) {
            throw new Error("No file data");
        }

        if (isText) {
            const textContent = decodeURIComponent(escape(atob(base64)));
            messages[messages.length - 1] = {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `File contents of ${fileName}:\n\n${textContent}`,
                    },
                    {
                        type: "text",
                        text: messages[messages.length - 1].content as string,
                    },
                ],
            };
        } else if (mediaType.startsWith("image/")) {
            messages[messages.length - 1] = {
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: mediaType,
                            data: base64,
                        },
                    },
                    {
                        type: "text",
                        text: messages[messages.length - 1].content as string,
                    },
                ],
            };
        }
    }

    async createChatCompletion(messages: Message[], model: string) {
        return await this.client.messages.create({
            model,
            max_tokens: 4096,
            temperature: 0.7,
            tools,
            tool_choice: { type: "auto" },
            messages,
            system: `You are a financial data visualization expert...`, // Full system prompt here
        });
    }
}

export default new AnthropicService();