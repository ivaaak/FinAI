import type { Theme } from '@/hooks/useTheme';
import type { Market } from '@/data/markets';
import { TradingViewWidget } from './TradingViewWidget';

export function TickerTape({ market, theme }: { market: Market; theme: Theme }) {
  return (
    <div className="h-[46px] overflow-hidden border-b bg-card">
      <TradingViewWidget
        script="embed-widget-ticker-tape.js"
        config={{
          symbols: market.symbols.map((s) => ({ proName: s.symbol, title: s.short })),
          showSymbolLogo: true,
          isTransparent: true,
          displayMode: 'adaptive',
          colorTheme: theme,
          locale: 'en',
        }}
      />
    </div>
  );
}
