// src/utils/processChart.ts
import { CHART_TYPES, ChartConfigItem, ChartData, ChartDataRow, ChartType } from '../types/chart';

const CHART_COLOR_COUNT = 5;

const isChartType = (value: unknown): value is ChartType =>
  typeof value === 'string' && (CHART_TYPES as readonly string[]).includes(value);

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[$,%\s]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

/**
 * Validates and normalizes the raw input of a `generate_graph_data` tool call.
 * Returns null when the input can't be turned into a renderable chart.
 */
export const processToolResponse = (input: unknown): ChartData | null => {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;

  if (!isChartType(raw.chartType) || !Array.isArray(raw.data) || raw.data.length === 0) {
    return null;
  }
  if (!raw.chartConfig || typeof raw.chartConfig !== 'object') return null;

  const rawConfig = (raw.config && typeof raw.config === 'object' ? raw.config : {}) as ChartData['config'];
  const config: ChartData['config'] = {
    ...rawConfig,
    title: rawConfig.title || 'Chart',
    description: rawConfig.description || '',
  };
  const chartConfig = raw.chartConfig as Record<string, ChartConfigItem>;
  const seriesKeys = Object.keys(chartConfig);
  if (seriesKeys.length === 0) return null;

  const rows = raw.data.filter((row): row is Record<string, unknown> => !!row && typeof row === 'object');
  let data: ChartDataRow[];

  if (raw.chartType === 'pie') {
    const valueKey = seriesKeys[0];
    const segmentKey = config.xAxisKey || 'segment';
    data = rows.map((row) => ({
      segment: String(row[segmentKey] ?? row.segment ?? row.category ?? row.name ?? ''),
      value: toNumber(row[valueKey] ?? row.value),
    }));
    config.xAxisKey = 'segment';
  } else {
    // Default the x-axis to the first non-series key when the model omitted it.
    if (!config.xAxisKey) {
      config.xAxisKey = Object.keys(rows[0] ?? {}).find((key) => !seriesKeys.includes(key));
    }
    data = rows.map((row) => {
      const normalized: ChartDataRow = {};
      for (const [key, value] of Object.entries(row)) {
        normalized[key] = seriesKeys.includes(key)
          ? toNumber(value)
          : typeof value === 'number' || typeof value === 'string'
            ? value
            : value == null
              ? null
              : String(value);
      }
      return normalized;
    });
  }

  const processedChartConfig = Object.fromEntries(
    seriesKeys.map((key, index) => [
      key,
      {
        ...chartConfig[key],
        label: chartConfig[key]?.label || key,
        color: `hsl(var(--chart-${(index % CHART_COLOR_COUNT) + 1}))`,
      },
    ]),
  );

  return {
    chartType: raw.chartType,
    config,
    data,
    chartConfig: processedChartConfig,
  };
};
