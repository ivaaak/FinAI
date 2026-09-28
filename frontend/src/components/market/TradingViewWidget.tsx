import { memo, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TradingViewWidgetProps {
  /** Script name under https://s3.tradingview.com/external-embedding/, e.g. "embed-widget-ticker-tape.js" */
  script: string;
  config: Record<string, unknown>;
  className?: string;
}

/**
 * Generic wrapper for TradingView's embeddable widgets. The widget script reads its
 * JSON config from the script tag body and renders an iframe next to it.
 * The widget is re-created whenever the config changes (e.g. symbol or theme).
 */
export const TradingViewWidget = memo(function TradingViewWidget({ script, config, className }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const configJson = JSON.stringify(config);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Deferred so an immediate unmount (React StrictMode, fast symbol switching) cancels the
    // injection; a removed-but-still-loading embed script throws when it can't find its container.
    const timer = window.setTimeout(() => {
      container.innerHTML = '';
      const widget = document.createElement('div');
      widget.className = 'tradingview-widget-container__widget';
      container.appendChild(widget);

      const scriptEl = document.createElement('script');
      scriptEl.type = 'text/javascript';
      scriptEl.src = `https://s3.tradingview.com/external-embedding/${script}`;
      scriptEl.async = true;
      scriptEl.innerHTML = configJson;
      container.appendChild(scriptEl);
    }, 50);

    return () => {
      window.clearTimeout(timer);
      container.innerHTML = '';
    };
  }, [script, configJson]);

  return <div ref={containerRef} className={cn('tradingview-widget-container', className)} />;
});
