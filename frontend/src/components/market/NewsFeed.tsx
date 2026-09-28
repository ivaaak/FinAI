import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import type { MarketSymbol } from '@/data/markets';
import type { Theme } from '@/hooks/useTheme';
import { TradingViewWidget } from './TradingViewWidget';

export function NewsFeed({ symbol, theme }: { symbol: MarketSymbol; theme: Theme }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>Latest news · {symbol.short}</CardTitle>
      </CardHeader>
      <div className="h-[420px]">
        <TradingViewWidget
          script="embed-widget-timeline.js"
          config={{
            feedMode: 'symbol',
            symbol: symbol.symbol,
            isTransparent: true,
            displayMode: 'regular',
            width: '100%',
            height: '100%',
            colorTheme: theme,
            locale: 'en',
          }}
        />
      </div>
    </Card>
  );
}
