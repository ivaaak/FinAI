import { Icon } from "./Icon";
import './AddComponent.css';
import TradingViewTickers from "../tradingView/TradingViewTickers";
import { useState } from "react";
import stockSymbols from '../../assets/stockSymbols.json';
import cryptoSymbols from '../../assets/cryptoSymbols.json';

export const AddComponent = () => {
    const [showCryptoSymbols, setShowCryptoSymbols] = useState(false);

    const toggleSymbols = () => {
       setShowCryptoSymbols(!showCryptoSymbols);
    };
    
    const currentSymbols = showCryptoSymbols ? cryptoSymbols : stockSymbols;

    return (
        <div>
            <button onClick={toggleSymbols}>Toggle Symbols</button>
            <TradingViewTickers symbols={currentSymbols} locale="uk" />
            <div className="text-white-bold mt-3">
                No Components Created Yet
            </div>
            <div className="mt-2">Simply create your first component</div>
            <div className="mt-1">Just click on the button</div>
            <div className="flex items-center p-3 mt-3 button-container">
                <Icon path="res-react-dash-add-component" className="w-5 h-5" />
                <div className="ml-2">Add Component</div>
                <div className="ml-2 background-blue">
                    129
                </div>
            </div>
        </div>
    );
}
