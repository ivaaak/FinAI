import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { MarketSymbol } from '@/data/markets';
import type { Theme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { TradingViewWidget } from './TradingViewWidget';

const INTERVALS = [
  { id: '60', label: '1H' },
  { id: 'D', label: '1D' },
  { id: 'W', label: '1W' },
  { id: 'M', label: '1M' },
];

interface ChartPanelProps {
  symbol: MarketSymbol;
  theme: Theme;
  onAnalyze: () => void;
}

export function ChartPanel({ symbol, theme, onAnalyze }: ChartPanelProps) {
  const [interval, setChartInterval] = useState('D');

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h1 className="text-lg font-semibold tracking-tight">{symbol.short}</h1>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
              {symbol.symbol.split(':')[0].replace('_', ' ')}
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">{symbol.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md bg-muted p-0.5" role="group" aria-label="Chart interval">
            {INTERVALS.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => setChartInterval(i.id)}
                aria-pressed={interval === i.id}
                className={cn(
                  'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                  interval === i.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {i.label}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={onAnalyze}>
            <Sparkles />
            Analyze
          </Button>
        </div>
      </div>
      <div className="h-[420px] md:h-[500px]">
        <TradingViewWidget
          script="embed-widget-advanced-chart.js"
          config={{
            autosize: true,
            symbol: symbol.symbol,
            interval,
            timezone: 'Etc/UTC',
            theme,
            style: '1',
            locale: 'en',
            backgroundColor: theme === 'dark' ? 'rgba(20, 23, 31, 1)' : 'rgba(255, 255, 255, 1)',
            allow_symbol_change: false,
            hide_volume: false,
            calendar: false,
            support_host: 'https://www.tradingview.com',
          }}
        />
      </div>
    </Card>
  );
}
