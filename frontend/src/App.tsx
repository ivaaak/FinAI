import { useCallback, useState } from 'react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Header } from '@/components/Header';
import { ChartPanel } from '@/components/market/ChartPanel';
import { NewsFeed } from '@/components/market/NewsFeed';
import { TickerTape } from '@/components/market/TickerTape';
import { Watchlist } from '@/components/market/Watchlist';
import { findSymbol, getMarket, type MarketId, type MarketSymbol } from '@/data/markets';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/hooks/useTheme';
import type { Provider } from '@/types/chat';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [marketId, setMarketId] = useLocalStorage<MarketId>('finai.market', 'stocks');
  const [selectedSymbol, setSelectedSymbol] = useLocalStorage<string>('finai.symbol', 'NASDAQ:AAPL');
  const [provider, setProvider] = useLocalStorage<Provider>('finai.provider', 'claude');
  const [model, setModel] = useLocalStorage<string>('finai.model', 'claude-opus-5');
  const [draft, setDraft] = useState<{ text: string; nonce: number }>();

  const market = getMarket(marketId);
  const symbol: MarketSymbol = findSymbol(selectedSymbol) ?? market.symbols[0];

  const changeMarket = (id: MarketId) => {
    setMarketId(id);
    setSelectedSymbol(getMarket(id).symbols[0].symbol);
  };

  const analyzeSymbol = useCallback((s: MarketSymbol) => {
    setDraft({
      text: `Analyze ${s.name} (${s.short}): recent performance, key drivers, risks and what to watch next.`,
      nonce: Date.now(),
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Header marketId={marketId} onMarketChange={changeMarket} theme={theme} onToggleTheme={toggleTheme} />
      <TickerTape market={market} theme={theme} />

      <main className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="min-w-0 space-y-4">
          <ChartPanel symbol={symbol} theme={theme} onAnalyze={() => analyzeSymbol(symbol)} />
          <div className="grid gap-4 md:grid-cols-[280px_minmax(0,1fr)]">
            <Watchlist market={market} selected={symbol.symbol} onSelect={(s) => setSelectedSymbol(s.symbol)} />
            <NewsFeed symbol={symbol} theme={theme} />
          </div>
        </div>

        <ChatPanel
          symbol={symbol}
          provider={provider}
          model={model}
          onProviderChange={setProvider}
          onModelChange={setModel}
          draft={draft}
        />
      </main>

      <footer className="mx-auto max-w-[1600px] px-4 pb-6 text-center text-xs text-muted-foreground">
        Market data and charts by TradingView. AI output is for informational purposes only and is not financial advice.
      </footer>
    </div>
  );
}

export default App;
