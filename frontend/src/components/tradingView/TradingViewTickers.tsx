import { useEffect } from 'react';

interface Symbol {
    title: string;
    proName: string;
}

interface TradingViewTickerProps {
    symbols: Symbol[];
    locale: string;
}

const TradingViewTickers: React.FC<TradingViewTickerProps> = ({ symbols, locale }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
        script.async = true;
        script.className = "tradingview-widget-container__widget"
        script.id = 'tradingview-widget-container';
        script.innerHTML = JSON.stringify({ symbols, locale });

        const rootElement = document.getElementById("root");
        if (rootElement) {
            rootElement.appendChild(script);
        }

        return () => {
            if (rootElement) {
                rootElement.removeChild(script);
            }
        };
    }, [symbols, locale]);

    return (
        <div >
        </div>
    );
};

export default TradingViewTickers;
