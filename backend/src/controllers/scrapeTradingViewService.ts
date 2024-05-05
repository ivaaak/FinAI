import express from "express";
import puppeteer from "puppeteer"

const scrapeService = express.Router();

async function scrapeTradingViewData(ticker: any) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.tradingview.com/symbols/${ticker}/`, { waitUntil: 'networkidle2' });

    // Extract data from the page
    // TODO actual scraping logic
    // inspect the TradingView page and write selectors to extract the data
    const data = await page.evaluate(() => {
        // Example: Extracting the chart title
        const titleElement = document.querySelector('h1.chart-title') as HTMLElement;
        // Add more data extraction logic here
        return { titleElement };
    });

    await browser.close();
    return data;
}

scrapeService.get('/scrape/:ticker', async (req, res) => {
    const ticker = req.params.ticker;
    try {
        const data = await scrapeTradingViewData(ticker);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error scraping data');
    }
});


// Export the router
export default scrapeService;