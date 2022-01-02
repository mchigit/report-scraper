const puppeteer = require("puppeteer");
require('dotenv').config()

const retry = require('retry');
const { scrapeAdpPayRoll } = require("./adpReport");

(async () => {
    const operation = retry.operation({
        retries: 5,
        maxTimeout: 60 * 1000,
    })
    operation.attempt(async (currentAttempt) => {
        console.log(`Try Scrape ADP attempt: ${currentAttempt}`)
        await scrapeAdpPayRoll()
    })
})();
