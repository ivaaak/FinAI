// Mirrors backend/src/types/chart.ts
export type ChartType = 'bar' | 'multiBar' | 'line' | 'pie' | 'area' | 'stackedArea';

export interface ChartConfigItem {
  label: string;
  stacked?: boolean;
  color?: string;
}

export interface ChartData {
  chartType: ChartType;
  config: {
    title: string;
    description: string;
    trend?: { percentage: number; direction: 'up' | 'down' };
    footer?: string;
    totalLabel?: string;
    xAxisKey?: string;
  };
  data: Record<string, string | number | null>[];
  chartConfig: Record<string, ChartConfigItem>;
}
