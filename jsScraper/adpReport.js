const puppeteer = require("puppeteer");
const config = require("./config");

const {
  getPreviousMonthStart,
  getPreviousMonthEnd,
  getToday,
  getCurrentMonthStart,
  getCurrentMonthEnd,
} = require("./utils/date");
const { extractWindowOpenUrl } = require("./utils/strings");

const adpUser = process.env.ADP_USER;
const adpPassword = process.env.ADP_PASSWORD;
const adpClientNum = process.env.ADP_CLIENT_NUM;

const SCRAPE_DATE_TYPE = {
  CURRENT_MONTH: "currentMonth",
  LAST_MONTH: "lastMonth",
  FROM_DATE: "fromDate",
};

async function login(page) {
  const user = page.$('input[name="user"]');
  const password = page.$("#Password1");
  const clientNum = page.$('input[name="clientNum"]');

  await page.$eval(
    'input[name="user"]',
    (el, userName) => (el.value = userName),
    adpUser
  );
  await page.$eval(
    "#Password1",
    (el, adpPassword) => (el.value = adpPassword),
    adpPassword
  );
  await page.$eval(
    'input[name="clientNum"]',
    (el, adpClientNum) => (el.value = adpClientNum),
    adpClientNum
  );

  await page.$eval("#Form1", (form) => form.submit());
}

async function fillInDate(page, dateType, from) {
  let startDate, endDate;

  switch (dateType) {
    case SCRAPE_DATE_TYPE.CURRENT_MONTH:
      startDate = getCurrentMonthStart();
      endDate = getCurrentMonthEnd();
      break;
    case SCRAPE_DATE_TYPE.LAST_MONTH:
      startDate = getPreviousMonthStart();
      endDate = getPreviousMonthEnd();
      break;
    case SCRAPE_DATE_TYPE.FROM_DATE:
      endDate = getToday();
      if (!from) {
        throw new Error("A date is required.")
      }
      startDate = from;
      break;
    default:
      throw new Error("Date type not recognized.")
  }

  await page.$eval(
    'input[name="Pay Date"]',
    (el, start) => (el.value = start),
    startDate
  );
  await page.$eval(
    'input[name="Pay Date2"]',
    (el, end) => (el.value = end),
    endDate
  );
}

async function handleReportLinkClicked(page, reportLinks) {
  for (const reportLink of reportLinks) {
    const nextHref = extractWindowOpenUrl(reportLink.href);
    const innerText = reportLink.innerText;

    console.log(`Scraping report for ${innerText}...`);

    const currentLoc = await page.evaluate(() => window.location);

    const client = await page.target().createCDPSession();

    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: process.env.DOWNLOAD_PATH,
    });

    await client.send("Fetch.enable", {
      patterns: [
        {
          urlPattern: "*",
          requestStage: "Response",
        },
      ],
    });

    await client.on("Fetch.requestPaused", async (reqEvent) => {
      const { requestId } = reqEvent;

      const responseHeaders = reqEvent.responseHeaders || [];

      const contentTypeHeader = responseHeaders.filter(
        (header) => header.name.toLowerCase() === "content-type"
      );

      if (
        contentTypeHeader &&
        contentTypeHeader.length > 0 &&
        contentTypeHeader[0].value === "application/pdf"
      ) {
        const attachmentHeader = {
          name: "content-disposition",
          value: `attachment; filename="${reportLink.innerText}-paystub.pdf"`,
        };

        const existingDispositionHeader = responseHeaders.findIndex(
          (header) => header.name.toLowerCase() === "content-disposition"
        );

        if (existingDispositionHeader) {
          responseHeaders[existingDispositionHeader] = attachmentHeader;
        } else {
          responseHeaders.push(attachmentHeader);
        }

        const responseObj = await client.send("Fetch.getResponseBody", {
          requestId,
        });

        await client.send("Fetch.fulfillRequest", {
          requestId,
          responseCode: 200,
          responseHeaders,
          body: responseObj.body,
        });
      } else {
        await client.send("Fetch.continueRequest", { requestId });
      }
    });

    await page.goto(`${currentLoc.origin}/secure/${nextHref}`);

    await page.waitForTimeout(5000);

    await client.send("Fetch.disable");
  }
}

async function scrapeAdpPayRoll(dateType, from) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(10 * 1000);
  await page.goto(config.adpUrl);

  await login(page);

  await page.waitForNavigation();

  await page.select(
    'select[name="selectFolder"]',
    encodeURI("My Pay Statements")
  );

  const openLink = await page.$('a[href="javascript:onSubmitForm()"]');
  await openLink.click();
  await page.waitForNavigation();

  await fillInDate(page, dateType, from);

  const searchLink = await page.$('a[href="javascript:onSubmitForm();"]');
  await searchLink.click();
  await page.waitForNavigation();

  const form = await page.$('form[name="EmpUpdate"]');
  const table = await form.$('table[align="center"]');
  const reportLinks = await table.$$("a");
  const reportHrefs = await Promise.all(
    reportLinks.map(async (report) => {
      const hrefHandle = await report.getProperty("href");
      const innerText = await page.evaluate((el) => el.textContent, report);
      const hrefJson = await hrefHandle.jsonValue();

      return {
        href: hrefJson,
        innerText,
      };
    })
  );

  await handleReportLinkClicked(page, reportHrefs);

  console.log(`Processed ${reportHrefs.length} reports`)

  await browser.close();
}

module.exports = {
  scrapeAdpPayRoll,
};
