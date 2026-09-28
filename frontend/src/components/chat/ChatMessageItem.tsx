import { lazy, memo, Suspense, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AlertCircle, Bot, Check, Copy, FileText } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat';

// Recharts is large; load it only once a message actually contains a chart.
const FinanceChart = lazy(() =>
  import('@/components/charts/FinanceChart').then((m) => ({ default: m.FinanceChart })),
);

const chartFallback = <div className="h-80 animate-pulse rounded-lg border bg-muted/40" />;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          })
          .catch(() => undefined);
      }}
      className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
      aria-label="Copy message"
      title="Copy"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

export const ChatMessageItem = memo(function ChatMessageItem({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return (
      <div className="flex animate-fade-in flex-col items-end gap-1.5">
        {message.attachment && (
          <div className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-xs">
            <FileText className="size-3.5 text-primary" />
            <span className="max-w-[200px] truncate font-medium">{message.attachment.name}</span>
            <span className="text-muted-foreground">{formatBytes(message.attachment.size)}</span>
          </div>
        )}
        {message.content && (
          <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
            {message.content}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group flex animate-fade-in gap-3">
      <div
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
          message.error ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary',
        )}
      >
        {message.error ? <AlertCircle className="size-4" /> : <Bot className="size-4" />}
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        {message.content &&
          (message.error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {message.content}
            </p>
          ) : (
            <div className="chat-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noreferrer noopener">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ))}
        {message.charts?.map((chart, i) => (
          <Suspense key={i} fallback={chartFallback}>
            <FinanceChart chart={chart} />
          </Suspense>
        ))}
        {!message.error && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            {message.model && <span>{message.model}</span>}
            {message.content && <CopyButton text={message.content} />}
          </div>
        )}
      </div>
    </div>
  );
});
