import { LineChart, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MARKETS, type MarketId } from '@/data/markets';
import type { Theme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface HeaderProps {
  marketId: MarketId;
  onMarketChange: (id: MarketId) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ marketId, onMarketChange, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="border-b bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <a href="/" className="flex items-center gap-2 text-foreground">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LineChart className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">FinAI</span>
        </a>

        <nav aria-label="Markets" className="order-last w-full sm:order-none sm:w-auto">
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
            {MARKETS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onMarketChange(m.id)}
                aria-current={m.id === marketId ? 'page' : undefined}
                className={cn(
                  'flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  m.id === marketId
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </header>
  );
}
