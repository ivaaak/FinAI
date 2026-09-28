export type MarketId = 'stocks' | 'indexes' | 'forex' | 'crypto';

export interface MarketSymbol {
  /** TradingView symbol, e.g. "NASDAQ:AAPL" */
  symbol: string;
  /** Short label shown in lists and the ticker tape */
  short: string;
  name: string;
}

export interface Market {
  id: MarketId;
  label: string;
  symbols: MarketSymbol[];
}

export const MARKETS: Market[] = [
  {
    id: 'stocks',
    label: 'Stocks',
    symbols: [
      { symbol: 'NASDAQ:AAPL', short: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'NASDAQ:MSFT', short: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'NASDAQ:NVDA', short: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'NASDAQ:AMZN', short: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'NASDAQ:GOOGL', short: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'NASDAQ:META', short: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'NASDAQ:TSLA', short: 'TSLA', name: 'Tesla, Inc.' },
      { symbol: 'NYSE:BRK.B', short: 'BRK.B', name: 'Berkshire Hathaway Inc.' },
      { symbol: 'NYSE:JPM', short: 'JPM', name: 'JPMorgan Chase & Co.' },
      { symbol: 'NYSE:V', short: 'V', name: 'Visa Inc.' },
      { symbol: 'NYSE:PG', short: 'PG', name: 'Procter & Gamble Co.' },
      { symbol: 'NYSE:JNJ', short: 'JNJ', name: 'Johnson & Johnson' },
      { symbol: 'NYSE:DIS', short: 'DIS', name: 'Walt Disney Co.' },
      { symbol: 'NASDAQ:INTC', short: 'INTC', name: 'Intel Corporation' },
      { symbol: 'NASDAQ:PYPL', short: 'PYPL', name: 'PayPal Holdings, Inc.' },
    ],
  },
  {
    id: 'indexes',
    label: 'Indexes',
    symbols: [
      { symbol: 'FOREXCOM:SPXUSD', short: 'S&P 500', name: 'S&P 500 Index' },
      { symbol: 'FOREXCOM:NSXUSD', short: 'US 100', name: 'Nasdaq 100 Index' },
      { symbol: 'FOREXCOM:DJI', short: 'Dow 30', name: 'Dow Jones Industrial Average' },
      { symbol: 'FOREXCOM:UKXGBP', short: 'UK 100', name: 'FTSE 100 Index' },
      { symbol: 'INDEX:DEU40', short: 'DAX', name: 'DAX 40 Index' },
      { symbol: 'INDEX:NKY', short: 'Nikkei', name: 'Nikkei 225 Index' },
    ],
  },
  {
    id: 'forex',
    label: 'Forex',
    symbols: [
      { symbol: 'FX:EURUSD', short: 'EUR/USD', name: 'Euro / US Dollar' },
      { symbol: 'FX:GBPUSD', short: 'GBP/USD', name: 'British Pound / US Dollar' },
      { symbol: 'FX:USDJPY', short: 'USD/JPY', name: 'US Dollar / Japanese Yen' },
      { symbol: 'FX_IDC:GBPEUR', short: 'GBP/EUR', name: 'British Pound / Euro' },
      { symbol: 'FX:GBPJPY', short: 'GBP/JPY', name: 'British Pound / Japanese Yen' },
      { symbol: 'FX:USDCHF', short: 'USD/CHF', name: 'US Dollar / Swiss Franc' },
      { symbol: 'FX:AUDUSD', short: 'AUD/USD', name: 'Australian Dollar / US Dollar' },
      { symbol: 'FX:USDCAD', short: 'USD/CAD', name: 'US Dollar / Canadian Dollar' },
    ],
  },
  {
    id: 'crypto',
    label: 'Crypto',
    symbols: [
      { symbol: 'BITSTAMP:BTCUSD', short: 'BTC/USD', name: 'Bitcoin' },
      { symbol: 'BITSTAMP:ETHUSD', short: 'ETH/USD', name: 'Ethereum' },
      { symbol: 'BINANCE:SOLUSDT', short: 'SOL/USDT', name: 'Solana' },
      { symbol: 'BINANCE:BNBUSDT', short: 'BNB/USDT', name: 'BNB' },
      { symbol: 'BINANCE:XRPUSDT', short: 'XRP/USDT', name: 'XRP' },
      { symbol: 'BINANCE:ADAUSDT', short: 'ADA/USDT', name: 'Cardano' },
      { symbol: 'BINANCE:DOGEUSDT', short: 'DOGE/USDT', name: 'Dogecoin' },
    ],
  },
];

export const getMarket = (id: MarketId): Market => MARKETS.find((m) => m.id === id) ?? MARKETS[0];

export const findSymbol = (symbol: string): MarketSymbol | undefined =>
  MARKETS.flatMap((m) => m.symbols).find((s) => s.symbol === symbol);
