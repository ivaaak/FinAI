// src/controllers/financeController.ts
import { Request, Response } from 'express';
import anthropicService from '../services/anthropicService';
import { Message, FileData } from '../types/message';
import Anthropic from '@anthropic-ai/sdk';
import { processToolResponse } from '../utils/processChart';
import { validateRequest } from '../utils/validation';

interface FinanceRequest {
  messages: Message[];
  fileData?: FileData;
  model: string;
}

class FinanceController {
  async handleFinanceRequest(req: Request<{}, {}, FinanceRequest>, res: Response): Promise<void> {
    try {
      const { messages, fileData, model } = req.body;

      console.log("🔍 Initial Request Data:", {
        hasMessages: !!messages,
        messageCount: messages?.length,
        hasFileData: !!fileData,
        fileType: fileData?.mediaType,
        model,
      });

      validateRequest(messages, model);

      const anthropicMessages = await anthropicService.processMessages(
        messages,
        fileData
      );

      const response = await anthropicService.createChatCompletion(
        anthropicMessages,
        model
      );

      console.log("✅ Anthropic API Response received:", {
        status: "success",
        stopReason: response.stop_reason,
        hasToolUse: response.content.some((c) => c.type === "tool_use"),
        contentTypes: response.content.map((c) => c.type),
      });

      const toolUseContent = response.content.find((c) => c.type === "tool_use");
      const textContent = response.content.find((c) => c.type === "text");
      const processedChartData = toolUseContent
        ? processToolResponse(toolUseContent)
        : null;

      res.json({
        content: textContent?.text || "",
        hasToolUse: response.content.some((c) => c.type === "tool_use"),
        toolUse: toolUseContent,
        chartData: processedChartData,
      });
    } catch (error) {
      console.error("❌ Finance API Error: ", error);
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof Anthropic.APIError) {
      res.status(error.status).json({
        error: "API Error",
        details: error.message,
        code: error.status,
      });
      return;
    }

    if (error instanceof Anthropic.AuthenticationError) {
      res.status(401).json({
        error: "Authentication Error",
        details: "Invalid API key or authentication failed",
      });
      return;
    }

    res.status(500).json({
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

export default new FinanceController();