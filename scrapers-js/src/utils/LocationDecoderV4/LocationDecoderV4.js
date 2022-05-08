const minimal_args = require('./pupeeterGunConfig');
const puppeteer = require('puppeteer');
const path = require('path');

class LocationDecoder {
  constructor(selectors, locationName, baseUrl) {
    this.selectors = selectors;

    this.locationName = locationName;
    this.baseUrl = baseUrl;
  }

  async search(page) {
    await page.goto(this.baseUrl, { waitUntil: 'networkidle2' });

    const { searchInputSelector, searchButtonSelector } = this.selectors;

    await page.screenshot({
      path: path.join(__dirname, 'progressPNGs', 'step1.png'),
    });

    // TODO have a array of selectors

    await page.waitForSelector(searchInputSelector.query);
    // await page.type(searchInputSelector.query, this.locationName, {
    //   delay: 100,
    // });

    // const ceva = await page.$eval(searchInputSelector.query, (el) => {
    //   return el.value;
    // });

    // console.log(ceva);


    
    // await page.focus(searchInputSelector.query);
    await page.screenshot({
      path: path.join(__dirname, 'progressPNGs', 'step2.png'),
    });

    await page.waitForSelector(searchButtonSelector.query);


    await page.evaluate(
      (locationName, searchInputSelector, searchButtonSelector) => {
        document.querySelectorAll(searchInputSelector.query)[
          searchInputSelector.itemCount
        ].value = locationName;

        document
          .querySelectorAll(searchButtonSelector.query)
          [searchButtonSelector.itemCount].click();
      },
      this.locationName,
      searchInputSelector,
      searchButtonSelector
    );

    
    // await page.focus(searchButtonSelector.query);
    // await page.click(searchButtonSelector.query);
    // await page.keyboard.type('\n');
    // await page.$eval(searchButtonSelector.query, (elem) => elem.click());

    await page.screenshot({
      path: path.join(__dirname, 'progressPNGs', 'step3.png'),
    });

    // await page.waitForNavigation({ waitUntil: 'networkidle2' });
    // await page.waitForSelector('[data-testid="property-card"]');

    // await page.focus(searchButtonSelector.query);

    // await page.waitForTimeout(5000);

    await page.screenshot({
      path: path.join(__dirname, 'progressPNGs', 'step4.png'),
    });

    const url = await page.url();
    return url;
  }

  async getLocationIdFromUrl() {
    const browser = await puppeteer.launch({
      args: minimal_args,
      headless: true,
      userDataDir: path.join(__dirname, './userCache'),
      slowMo: 10,
      // proxy,
    });

    let page = await browser.newPage();

    const rawUrl = await this.search(page);

    console.log(rawUrl);

    browser.close();
  }
}

module.exports = LocationDecoder;
