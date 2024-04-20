import { useEffect, useRef } from 'react';

interface Symbol {
    title: string;
    proName: string;
}

interface TradingViewTickerProps {
    symbols: Symbol[];
    locale: string;
}

const TradingViewTickers: React.FC<TradingViewTickerProps> = ({ symbols, locale }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
        script.async = true;
        script.className = "tradingview-widget-container__widget";
        script.id = 'tradingview-widget-container';
        script.innerHTML = JSON.stringify({ symbols, locale });

        const container = containerRef.current;
        if (container) {
            container.appendChild(script);
        }

        return () => {
            if (container) {
                container.removeChild(script);
            }
        };
    }, [symbols, locale]);

    return (
        <div ref={containerRef} className="tickers">
        </div>
    );
};

export default TradingViewTickers;
