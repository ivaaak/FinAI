const data = {
    ticker: "AAPL",
    data: [
      // Each object in the array represents a day's data
      {
        date: "2023-04-01",
        open: 150.00,
        high: 152.50,
        low: 148.00,
        close: 151.00,
        volume: 1000000
      },
      // Add more days as needed
    ]
  };
  
  const formattedData = data.data.map(day => `
  Stock Ticker: ${data.ticker}
  Date: ${day.date}
  Opening Price: ${day.open}
  Highest Price: ${day.high}
  Lowest Price: ${day.low}
  Closing Price: ${day.close}
  Trading Volume: ${day.volume}
  Trend: ${day.close > day.open? 'Increased' : day.close < day.open? 'Decreased' : 'Stable'}
  Volume Insights: ${day.volume > 2000000? 'High volume, possibly indicating significant interest or events.' : 'Normal volume.'}
  `).join('\n');
  
  console.log(formattedData);
  