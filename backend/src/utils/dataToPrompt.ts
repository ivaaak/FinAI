import { PromptTemplate, StockData } from "../data/entities/finance";

const HIGH_VOLUME_THRESHOLD = 2_000_000;

const describeTrend = (day: StockData): string =>
  day.close > day.open ? "Increased" : day.close < day.open ? "Decreased" : "Stable";

/** Formats daily OHLCV rows into a compact, LLM-friendly text block. */
export function formatStockData(ticker: string, data: StockData[]): string {
  const rows = data.map(
    (day) =>
      `${day.date} | O ${day.open} | H ${day.high} | L ${day.low} | C ${day.close} | Vol ${day.volume} | ${describeTrend(day)}` +
      (day.volume > HIGH_VOLUME_THRESHOLD ? " | high volume" : "")
  );
  return [`Stock Ticker: ${ticker}`, "Date | Open | High | Low | Close | Volume | Trend", ...rows].join("\n");
}

/** Replaces `{placeholder}` tokens in a template. Unknown placeholders are left as-is. */
export function fillTemplate(template: PromptTemplate, values: Record<string, string>): string {
  return template.prompt.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
