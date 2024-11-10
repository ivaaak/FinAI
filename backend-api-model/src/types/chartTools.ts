// src/utils/chartTools.ts
import { ToolSchema } from '../types/tool';

export const tools: ToolSchema[] = [
    {
        name: "generate_graph_data",
        description:
            "Generate structured JSON data for creating financial charts and graphs.",
        input_schema: {
            type: "object",
            properties: {
                chartType: {
                    type: "string",
                    enum: ["bar", "multiBar", "line", "pie", "area", "stackedArea"],
                    description: "The type of chart to generate",
                },
                config: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        trend: {
                            type: "object",
                            properties: {
                                percentage: { type: "number" },
                                direction: {
                                    type: "string",
                                    enum: ["up", "down"],
                                },
                            },
                            required: ["percentage", "direction"],
                        },
                        footer: { type: "string" },
                        totalLabel: { type: "string" },
                        xAxisKey: { type: "string" },
                    },
                    required: ["title", "description"],
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        additionalProperties: true,
                    },
                },
                chartConfig: {
                    type: "object",
                    additionalProperties: {
                        type: "object",
                        properties: {
                            label: { type: "string" },
                            stacked: { type: "boolean" },
                        },
                        required: ["label"],
                    },
                },
            },
            required: ["chartType", "config", "data", "chartConfig"],
        },
    },
];