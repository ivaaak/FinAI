import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Market, MarketSymbol } from '@/data/markets';
import { cn } from '@/lib/utils';

interface WatchlistProps {
  market: Market;
  selected: string;
  onSelect: (symbol: MarketSymbol) => void;
}

export function Watchlist({ market, selected, onSelect }: WatchlistProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return market.symbols;
    return market.symbols.filter(
      (s) => s.short.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q),
    );
  }, [market.symbols, query]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{market.label}</CardTitle>
        <span className="text-xs text-muted-foreground">{market.symbols.length} symbols</span>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-2 px-2">
        <label className="relative mx-2 block">
          <span className="sr-only">Filter symbols</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter…"
            className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <ul className="max-h-[360px] overflow-y-auto scrollbar-thin" role="listbox" aria-label={`${market.label} symbols`}>
          {filtered.map((s) => {
            const isSelected = s.symbol === selected;
            return (
              <li key={s.symbol} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => onSelect(s)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors',
                    isSelected ? 'bg-primary/10' : 'hover:bg-accent',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-md text-[10px] font-bold',
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {s.short.replace(/[^A-Z0-9]/gi, '').slice(0, 4)}
                  </span>
                  <span className="min-w-0">
                    <span className={cn('block text-sm font-medium', isSelected && 'text-primary')}>{s.short}</span>
                    <span className="block truncate text-xs text-muted-foreground">{s.name}</span>
                  </span>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && <li className="px-2 py-6 text-center text-xs text-muted-foreground">No matches</li>}
        </ul>
      </CardContent>
    </Card>
  );
}
