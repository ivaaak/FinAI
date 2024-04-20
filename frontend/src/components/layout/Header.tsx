import './Header.css';
import TradingViewTickers from "../tradingView/TradingViewTickers";
import { useState } from "react";
import stockSymbols from '../../assets/stockSymbols.json';
import cryptoSymbols from '../../assets/cryptoSymbols.json';

export const Header = () => {
    const [showCryptoSymbols, setShowCryptoSymbols] = useState(false);

    const toggleSymbols = () => {
       setShowCryptoSymbols(!showCryptoSymbols);
    };
    
    const currentSymbols = showCryptoSymbols ? cryptoSymbols : stockSymbols;

    return (
        <div className="headerNav">
            <button onClick={toggleSymbols}>Stocks</button>
            <button onClick={toggleSymbols}>Indexes</button>
            <button onClick={toggleSymbols}>Currency Pairs</button>
            <button onClick={toggleSymbols}>Crypto</button>
            Using LLMs to give predictions
            <TradingViewTickers symbols={currentSymbols} locale="uk" />
        </div>
    );
}
