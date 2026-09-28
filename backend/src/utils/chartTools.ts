// src/utils/chartTools.ts
import type Anthropic from '@anthropic-ai/sdk';
import { CHART_TYPES } from '../types/chart';

export const CHART_TOOL_NAME = 'generate_graph_data';

export const tools: Anthropic.Beta.BetaTool[] = [
  {
    name: CHART_TOOL_NAME,
    description:
      'Render a financial chart in the user interface. Call this whenever a visual would help: ' +
      'price or revenue trends over time (line/area), comparisons between categories or periods ' +
      '(bar/multiBar), composition or allocation breakdowns (pie), and cumulative contributions ' +
      '(stackedArea). Each key in chartConfig must match a numeric field present in every data row. ' +
      'Use at most 5 series per chart (and at most 5 pie segments - group the rest as "Other").',
    input_schema: {
      type: 'object',
      properties: {
        chartType: {
          type: 'string',
          enum: [...CHART_TYPES],
          description: 'The type of chart to render',
        },
        config: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Short chart title' },
            description: { type: 'string', description: 'One-sentence summary of what the chart shows' },
            trend: {
              type: 'object',
              description: 'Overall change across the chart, if meaningful',
              properties: {
                percentage: { type: 'number' },
                direction: { type: 'string', enum: ['up', 'down'] },
              },
              required: ['percentage', 'direction'],
            },
            footer: { type: 'string', description: 'Data source or caveat shown under the chart' },
            totalLabel: { type: 'string', description: 'Label for the total (pie charts)' },
            xAxisKey: {
              type: 'string',
              description: 'Data row key used for the x-axis / pie segments (e.g. "month", "quarter")',
            },
          },
          required: ['title', 'description'],
        },
        data: {
          type: 'array',
          description: 'Data rows. Each row holds the x-axis key plus one numeric value per series.',
          items: {
            type: 'object',
            additionalProperties: true,
          },
        },
        chartConfig: {
          type: 'object',
          description: 'One entry per numeric series, keyed by the data row field name',
          additionalProperties: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              stacked: { type: 'boolean' },
            },
            required: ['label'],
          },
        },
      },
      required: ['chartType', 'config', 'data', 'chartConfig'],
    },
  },
];
