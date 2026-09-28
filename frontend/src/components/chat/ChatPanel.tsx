import { useEffect, useRef } from 'react';
import { BarChart3, Bot, Cpu, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { ANALYSIS_PROMPTS } from '@/data/analysisPrompts';
import type { MarketSymbol } from '@/data/markets';
import { useChat } from '@/hooks/useChat';
import { useModels } from '@/hooks/useModels';
import type { Provider } from '@/types/chat';
import { ChatComposer } from './ChatComposer';
import { ChatMessageItem } from './ChatMessageItem';

interface ChatPanelProps {
  symbol: MarketSymbol;
  provider: Provider;
  model: string;
  onProviderChange: (provider: Provider) => void;
  onModelChange: (model: string) => void;
  draft?: { text: string; nonce: number };
}

export function ChatPanel({ symbol, provider, model, onProviderChange, onModelChange, draft }: ChatPanelProps) {
  const models = useModels();
  const { messages, isLoading, send, stop, clear } = useChat({ provider, model });
  const scrollRef = useRef<HTMLDivElement>(null);

  // If the stored model is no longer offered, fall back to the first one.
  useEffect(() => {
    if (!models.some((m) => m.id === model)) onModelChange(models[0].id);
  }, [model, models, onModelChange]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isLoading]);

  return (
    <Card className="flex h-[640px] flex-col overflow-hidden lg:sticky lg:top-4 lg:h-[calc(100vh-8.5rem)]">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Bot className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">AI Analyst</h2>
          <p className="truncate text-xs text-muted-foreground">
            {provider === 'claude' ? 'Charts, file analysis & research' : 'Private, runs on your machine'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={clear}
          disabled={messages.length === 0}
          aria-label="Clear conversation"
          title="Clear conversation"
        >
          <Trash2 />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 border-b bg-muted/30 px-4 py-2">
        <label className="space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground">Provider</span>
          <Select value={provider} onChange={(e) => onProviderChange(e.target.value as Provider)}>
            <option value="claude">Claude API</option>
            <option value="local">Local Llama</option>
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground">Model</span>
          <Select
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            disabled={provider !== 'claude'}
            title={models.find((m) => m.id === model)?.description}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-4 scrollbar-thin" aria-live="polite">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col justify-center gap-4 py-6">
            <div className="text-center">
              <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {provider === 'claude' ? <BarChart3 className="size-5" /> : <Cpu className="size-5" />}
              </div>
              <h3 className="text-sm font-semibold">Ask about {symbol.short}</h3>
              <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
                {provider === 'claude'
                  ? 'Get analysis with interactive charts. Attach a CSV, PDF statement or chart screenshot for data-driven answers.'
                  : 'Chat with a local model running on your machine via node-llama-cpp. The first reply takes a while as the model loads.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ANALYSIS_PROMPTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => send(p.build(symbol))}
                  className="rounded-lg border bg-background px-3 py-2 text-left text-xs transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  <span className="font-medium">{p.label}</span>
                  <span className="block text-muted-foreground">{symbol.short}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => <ChatMessageItem key={m.id} message={m} />)
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {provider === 'claude' ? 'Analyzing…' : 'The local model is thinking…'}
          </div>
        )}
      </div>

      <div className="border-t p-3">
        <ChatComposer
          isLoading={isLoading}
          allowFiles={provider === 'claude'}
          placeholder={`Ask about ${symbol.short} or any market…`}
          draft={draft}
          onSend={send}
          onStop={stop}
        />
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          AI analysis can be wrong and is not investment advice.
        </p>
      </div>
    </Card>
  );
}
