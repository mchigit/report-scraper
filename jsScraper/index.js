const puppeteer = require("puppeteer");
require("dotenv").config();
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const retry = require("retry");
const { scrapeAdpPayRoll } = require("./adpReport");
const argv = yargs(hideBin(process.argv)).argv;

(async () => {
  const operation = retry.operation({
    retries: 5,
    maxTimeout: 60 * 1000,
  });

  operation.attempt(async (currentAttempt) => {
    console.log(`Try Scrape ADP attempt: ${currentAttempt}`);
    await scrapeAdpPayRoll(argv.dateType, argv.from || null);
  });
})();
