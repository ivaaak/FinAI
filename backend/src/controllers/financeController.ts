// src/controllers/financeController.ts
import Anthropic from '@anthropic-ai/sdk';
import { NextFunction, Request, Response } from 'express';
import { MODELS, DEFAULT_MODEL } from '../config';
import anthropicService from '../services/anthropicService';
import { ChartData } from '../types/chart';
import { FinanceResponse } from '../types/message';
import { CHART_TOOL_NAME } from '../utils/chartTools';
import { processToolResponse } from '../utils/processChart';
import { validateRequest } from '../utils/validation';

const REFUSAL_MESSAGE =
  "I can't help with that request. Try rephrasing it, or ask about a different aspect of the data.";

class FinanceController {
  async handleFinanceRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messages, model, fileData } = validateRequest(req.body);

      console.log('🔍 Finance request:', {
        messageCount: messages.length,
        fileType: fileData?.mediaType,
        model,
      });

      const anthropicMessages = anthropicService.buildMessages(messages, fileData);
      const response = await anthropicService.createChatCompletion(anthropicMessages, model);

      console.log('✅ Anthropic response:', {
        model: response.model,
        stopReason: response.stop_reason,
        contentTypes: response.content.map((c) => c.type),
        usage: { input: response.usage.input_tokens, output: response.usage.output_tokens },
      });

      if (response.stop_reason === 'refusal') {
        res.json({
          content: REFUSAL_MESSAGE,
          charts: [],
          model: response.model,
          stopReason: response.stop_reason,
          usage: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
          },
        } satisfies FinanceResponse);
        return;
      }

      const text = response.content
        .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('\n\n')
        .trim();

      const charts = response.content
        .filter(
          (block): block is Anthropic.Beta.BetaToolUseBlock =>
            block.type === 'tool_use' && block.name === CHART_TOOL_NAME,
        )
        .map((block) => processToolResponse(block.input))
        .filter((chart): chart is ChartData => chart !== null);

      const payload: FinanceResponse = {
        content:
          text ||
          (response.stop_reason === 'max_tokens'
            ? 'The response was cut off because it was too long. Try asking a narrower question.'
            : ''),
        charts,
        model: response.model,
        stopReason: response.stop_reason,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      };

      res.json(payload);
    } catch (error) {
      next(error);
    }
  }

  listModels(_req: Request, res: Response): void {
    res.json({ models: MODELS, defaultModel: DEFAULT_MODEL });
  }
}

export default new FinanceController();
