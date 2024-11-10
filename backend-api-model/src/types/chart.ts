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

export type ChartType = 'bar' | 'multiBar' | 'line' | 'pie' | 'area' | 'stackedArea';

export interface ChartData {
    chartType: ChartType;
    config: ChartConfig;
    data: Record<string, any>[];
    chartConfig: Record<string, ChartConfigItem>;
}
