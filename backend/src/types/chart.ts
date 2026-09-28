// src/types/chart.ts
export interface TrendConfig {
  percentage: number;
  direction: 'up' | 'down';
}

export interface ChartConfig {
  title: string;
  description: string;
  trend?: TrendConfig;
  footer?: string;
  totalLabel?: string;
  xAxisKey?: string;
}

export interface ChartConfigItem {
  label: string;
  stacked?: boolean;
  color?: string;
}

export const CHART_TYPES = ['bar', 'multiBar', 'line', 'pie', 'area', 'stackedArea'] as const;

export type ChartType = (typeof CHART_TYPES)[number];

export type ChartDataRow = Record<string, string | number | null>;

export interface ChartData {
  chartType: ChartType;
  config: ChartConfig;
  data: ChartDataRow[];
  chartConfig: Record<string, ChartConfigItem>;
}
