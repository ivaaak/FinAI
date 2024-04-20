import { useState, useEffect } from 'react';
import './TradingViewDiagram.css';
import { ChatWindow } from '../ChatWindow';

interface TickerInfo {
    id: string;
    name: string;
    symbol: string;
    price_usd: number;
    percent_change_1h: number;
}

const TradingViewDiagram = () => {
    const [_btc, _eth, _ltc] = [0.15000000, 0.20000000, 2.05000000];
    const [cryptoData, setCryptoData] = useState<TickerInfo[]>([]);

    // useEffect(() => {
    //     const fetchCryptoPrices = async () => {
    //         const url = "https://api.coinmarketcap.com/v1/ticker/?limit=10";
    //         const response = await fetch(url);
    //         const data: TickerInfo[] = await response.json();
    //         const filteredData = data.filter(crypto => ["bitcoin", "ethereum", "litecoin"].includes(crypto.id));
           
    //         const tickerInfoData: TickerInfo[] = filteredData.map(crypto => ({
    //            id: crypto.id,
    //            name: crypto.name,
    //            symbol: crypto.symbol,
    //            price_usd: crypto.price_usd,
    //            percent_change_1h: crypto.percent_change_1h,
    //            // Map other properties as needed
    //         }));
           
    //         setCryptoData(tickerInfoData);
    //        };           
           

    //     fetchCryptoPrices();
    //     const intervalId = setInterval(fetchCryptoPrices, 10000);

    //     return () => clearInterval(intervalId); // Cleanup on component unmount
    // }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
          new window.TradingView.MediumWidget({
            container_id: 'tv-medium-widget-5e6f9',
            symbols: [
              ['Apple', 'AAPL '],
              ['Google', 'GOOGL'],
              ['Microsoft', 'MSFT'],
              ['Bitcoin', 'COINBASE:BTCUSD|1y'],
              ['Ethereum', 'COINBASE:ETHUSD|1y'],
              ['Litecoin', 'COINBASE:LTCUSD|1y'],
            ],
            greyText: 'Quotes by',
            gridLineColor: '#e9e9ea',
            fontColor: '#83888D',
            underLineColor: '#dbeffb',
            trendLineColor: '#4bafe9',
            width: '100%',
            height: '400px',
            locale: 'en',
          });
        };
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
     }, []);


    return (
        <div className="container">
            {/* <div className="cryptoCurrencies">
                {cryptoData.map(crypto => (
                    <div key={crypto.id} className="crypto">
                        <div className="name">{crypto.name} ({crypto.symbol})</div>
                        <div className="price">${crypto.price_usd} USD</div>
                        <div className={`change ${crypto.percent_change_1h < 0 ? 'negative' : 'positive'}`}>
                            {crypto.percent_change_1h < 0 ? '↓' : '↑'} {crypto.percent_change_1h}%
                        </div>
                        { <div className="worth">
                            $ {Math.round(crypto.price_usd * 
                                (_btc * 
                                (crypto.id === 'bitcoin') + _eth * 
                                (crypto.id === 'ethereum') + _ltc * 
                                (crypto.id === 'litecoin')))}
                        </div> }
                    </div>
                ))}
                <div id="total" className="crypto">
                    <div className="name">Total:</div>
                    <div className="price"></div>
                    <div className="change"></div>
                    {<div className="worth">
                        $ {cryptoData.reduce((total, crypto) => 
                        total + Math.round(crypto.price_usd * 
                        (_btc * (crypto.id === 'bitcoin') + _eth * 
                        (crypto.id === 'ethereum') + _ltc * 
                        (crypto.id === 'litecoin'))), 0)}
                    </div> }
                </div>
            </div> */}
            <div id="stockChart">
                <div id="tv-medium-widget-5e6f9"></div>
            </div>
            <div className="chatWindow">
                <ChatWindow messages={[]}></ChatWindow>
            </div>
        </div>
    );
};

export default TradingViewDiagram;
