import { useState } from 'react';
import './App.css';
import { ChatWindow } from './components/ChatWindow';
import stockSymbols from './assets/stockSymbols.json';
import cryptoSymbols from './assets/cryptoSymbols.json';
import TradingViewDiagram from './components/tradingView/TradingViewDiagram';
import TradingViewTickers from './components/tradingView/TradingViewTickers';

function App() {
   const [showCryptoSymbols, setShowCryptoSymbols] = useState(false);

   const toggleSymbols = () => {
      setShowCryptoSymbols(!showCryptoSymbols);
   };

   const currentSymbols = showCryptoSymbols ? cryptoSymbols : stockSymbols;

   return (
      <>
         <TradingViewTickers symbols={currentSymbols} locale="uk" />

         <div className="chatWindow">
            <button onClick={toggleSymbols}>Toggle Symbols</button>
            <ChatWindow messages={[]}></ChatWindow>
         </div>

         {/* <Sidebar conversations={[]}></Sidebar> */}
         <TradingViewDiagram></TradingViewDiagram>
      </>
   );
}

export default App;
