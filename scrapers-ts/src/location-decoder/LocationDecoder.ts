import { IFormConfiguration } from '../configurations/booking.com/conf';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import { minimal_args } from './puppeteerGunArgs';
import { Page } from 'puppeteer';
const ac = require('@antiadmin/anticaptchaofficial');
import fs from 'fs';
// import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';

class LocationDecoder {
  private selectors: IFormConfiguration;
  private locationName: string;
  private baseURL: URL;
  private ac: any;

  constructor(
    selectors: IFormConfiguration,
    locationName: string,
    baseURL: URL
  ) {
    this.selectors = selectors;
    this.locationName = locationName;
    this.baseURL = baseURL;
    puppeteer.use(StealthPlugin());
    // ac.setAPIKey('e399c3cfb39d72cb36df6d425cfcbc91');
  }

  private async acceptCookies(page: Page) {
    await page.waitForSelector('.css-47sehv');
    await page.click('.css-47sehv');
  }

  private async solveCaptcha(page: Page) {
    // Retrive reCap
    await page.waitForSelector('[data-key]');
    const reCaptchaSiteKey = await page.$eval('[data-key]', (element) => {
      return element.getAttribute('data-key');
    });

    let token = null;

    try {
      token = await ac.solveRecaptchaV3(
        this.baseURL.href,
        reCaptchaSiteKey,
        0.7,
        'PAGE_ACTION_CAN_BE_EMPTY'
      );
    } catch (e) {
      console.log(e);
    }

    await page.$eval(
      'input[name="recaptcha_token"]',
      (element: any, token) => {
        element.value = token;
      },
      token
    );

    console.log(reCaptchaSiteKey);
  }

  private async delay(time: number) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

  private async search(page: Page) {
    const { searchButtonSelector, searchInputSelector } = this.selectors;

    await page.goto(this.baseURL.href, {
      waitUntil: 'networkidle2',
      // waitUntil: 'load'
      // waitUntil: 'domcontentloaded'
      // waitUntil: 'networkidle2'
    });

    let content = await page.content();
    fs.writeFileSync('./out.html', content);

    await page.screenshot({
      path: path.join(__dirname, 'progressPNGs', 'step0.png'),
    });

    this.acceptCookies(page);

    await page.screenshot({
      path: path.join(__dirname, 'progressPNGs', 'step1.png'),
    });

    await page.waitForSelector(searchInputSelector.query);
    await page.waitForSelector(searchButtonSelector.query);

    await page.evaluate(
      (locationName, searchInputSelector, searchButtonSelector) => {
        document.querySelectorAll(searchInputSelector.query)[
          searchInputSelector.itemCount
        ].value = locationName;

        //   document.querySelector(searchButtonSelector.query).click();
      },
      this.locationName,
      searchInputSelector,
      searchButtonSelector
    );

    await page.screenshot({
      path: path.join(__dirname, 'progressPNGs', 'step2.png'),
    });

    // await page.type(searchInputSelector.query, this.locationName, {
    //   delay: 100,
    // });

    // await page.waitForSelector('.antigate_solver.solved').catch((_e) => console.log('failed to wait for the selector'));
    // console.log('recaptcha solved');

    await page.screenshot({
      path: path.join(__dirname, 'progressPNGs', 'step3.png'),
    });

    await page.setDefaultNavigationTimeout(0);

    await Promise.all([
      await page.click(searchButtonSelector.query),
      await page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    content = await page.content();
    fs.writeFileSync('./out2.html', content);

    // page.reload({waitUntil: 'networkidle2'});

    await page.screenshot({
      path: path.join(__dirname, 'progressPNGs', 'step4.png'),
    });

    await delay(10000);

    return page.url();
  }

  public async getLocationIdFromUrl() {
    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
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

export default LocationDecoder;
