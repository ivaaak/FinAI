// src/utils/processChart.ts
import { ChartData } from '../types/chart';

interface ToolUseContent {
  type: 'tool_use';
  input: ChartData;
}

export const processToolResponse = (toolUseContent: ToolUseContent | null): ChartData | null => {
  if (!toolUseContent) return null;

  const chartData = toolUseContent.input;

  if (!chartData.chartType || !chartData.data || !Array.isArray(chartData.data)) {
    throw new Error("Invalid chart data structure");
  }

  if (chartData.chartType === "pie") {
    chartData.data = chartData.data.map((item) => {
      const valueKey = Object.keys(chartData.chartConfig)[0];
      const segmentKey = chartData.config.xAxisKey || "segment";

      return {
        segment: item[segmentKey] || item.segment || item.category || item.name,
        value: item[valueKey] || item.value,
      };
    });

    chartData.config.xAxisKey = "segment";
  }

  const processedChartConfig = Object.entries(chartData.chartConfig).reduce(
    (acc, [key, config], index) => ({
      ...acc,
      [key]: {
        ...config,
        color: `hsl(var(--chart-${index + 1}))`,
      },
    }),
    {} as Record<string, any>
  );

  return {
    ...chartData,
    chartConfig: processedChartConfig,
  };
};