import type { MarketSymbol } from './markets';

export interface AnalysisPrompt {
  id: string;
  label: string;
  build: (s: MarketSymbol) => string;
}

// Structured analysis templates, filled in with the currently selected symbol.
export const ANALYSIS_PROMPTS: AnalysisPrompt[] = [
  {
    id: 'overview',
    label: 'Overview',
    build: (s) =>
      `Give me an overview of ${s.name} (${s.short}): what drives its price, the key metrics to watch, and the main risks.`,
  },
  {
    id: 'trend',
    label: 'Price trend',
    build: (s) =>
      `Describe the long-term price trend of ${s.name} (${s.short}) over the past few years, with approximate yearly figures and a line chart.`,
  },
  {
    id: 'volatility',
    label: 'Volatility & risk',
    build: (s) =>
      `How volatile is ${s.name} (${s.short}) compared to its benchmark? Explain the main risk factors and how to measure them.`,
  },
  {
    id: 'technicals',
    label: 'Technical indicators',
    build: (s) =>
      `Explain how to read the 50-day and 200-day moving averages, RSI and MACD for ${s.short}, and what a crossover would suggest.`,
  },
  {
    id: 'compare',
    label: 'Compare peers',
    build: (s) =>
      `Compare ${s.name} (${s.short}) with its closest peers on growth, valuation and risk. Include a comparison chart.`,
  },
  {
    id: 'scenarios',
    label: 'Bull vs bear case',
    build: (s) =>
      `Lay out a bull case and a bear case for ${s.name} (${s.short}) over the next 12 months, with the signals that would confirm each.`,
  },
];
