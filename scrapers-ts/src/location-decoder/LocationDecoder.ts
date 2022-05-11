import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import { minimal_args } from './puppeteerGunArgs';
const ac = require('@antiadmin/anticaptchaofficial');
import fs from 'fs';
import {
  IFormConfiguration,
  IGeneralSelector,
  ILocationDecoderConfiguration,
  IButtonSelector,
  IInputSelector,
} from '../types';
import { Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';

class LocationDecoder {
  private configurations: ILocationDecoderConfiguration[];
  private locationName: string;

  constructor(
    configurations: ILocationDecoderConfiguration[],
    locationName: string
  ) {
    this.configurations = configurations;
    this.locationName = locationName;
    puppeteer.use(StealthPlugin())
  }

  private async click(
    page: Page,
    selector: IGeneralSelector | IButtonSelector | IInputSelector
  ) {
    if (selector.buttonVisible === false) {
      page.evaluate((selector) => {
        const button = document.querySelectorAll(selector.query)[
          selector.itemCount
        ] as HTMLElement;
        button.click();
      }, selector);
    } else if (selector.focusOn === true) {
      page.focus(selector.query);
    } else {
      await page.waitForSelector(selector.query);
      await page.click(selector.query);
    }
  }

  private async acceptCookies(page: Page, acceptCookies: IGeneralSelector) {
    try {
      if (acceptCookies) {
        await page.waitForSelector(acceptCookies.query);
        await page.click(acceptCookies.query);
      }
    } catch (e) {
      console.log('No cookies appeard');
    }
  }

  private async solveCaptcha(page: Page, baseURL: URL) {
    ac.setAPIKey('e399c3cfb39d72cb36df6d425cfcbc91');
    await page.waitForSelector('[data-key]');
    const reCaptchaSiteKey = await page.$eval('[data-key]', (element) => {
      return element.getAttribute('data-key');
    });

    let token = null;

    try {
      token = await ac.solveRecaptchaV3(
        baseURL.href,
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
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  private async clearInput(page: Page) {
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
  }

  private async DOMCheckpoint(page: Page, id: number) {
    const content = await page.content();
    fs.writeFileSync(
      path.join(__dirname, 'DOMCheckpoints', `out${id}`),
      content
    );
  }

  private async search(
    page: Page,
    selectors: IFormConfiguration,
    baseURL: URL,
    needStyle: boolean
  ) {

    await page.setRequestInterception(true);

    page.on('request', (request) => {
      if (request.resourceType() === 'image' || request.resourceType() === 'font') {
        request.abort();
      } else if (request.resourceType() === 'stylesheet') {
        if (needStyle) {
          request.continue();
        } else {
          request.abort();
        }
      } else {
        request.continue();
      }
    });

    await page.setDefaultNavigationTimeout(0);
    const { searchButtonSelector, searchInputSelector } = selectors;
    

    await page.goto(baseURL.href, {
      waitUntil: 'domcontentloaded',
    });

    await this.delay(400);

    if (selectors.acceptCookiesSelector) {
      await this.acceptCookies(page, selectors.acceptCookiesSelector);
    }

    await this.delay(400);

    if (selectors.inputButtonSelector) {
      await this.click(page, selectors.inputButtonSelector);
    }

    await this.delay(200);

    await page.waitForSelector(searchInputSelector.query);

    await this.clearInput(page);
    await page.type(searchInputSelector.query, this.locationName, {
      delay: 150,
    });

    await this.delay(500);

    if (selectors.selectInputOption) {
      await this.click(page, selectors.selectInputOption);
    }

    await this.delay(200);

    if (selectors.extraStep) {
      await this.click(page, selectors.extraStep);
    }

    await this.delay(500);

    await Promise.all([
      this.click(page, searchButtonSelector),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    ]);

    const url = new URL(page.url());

    page.close();
    return url;
  }

  public async getOneUrl(
    url: URL,
    selectors: IFormConfiguration,
    needStyle: boolean
  ) {
    const browser = await puppeteer.launch({
      args: minimal_args,
      headless: false,
      userDataDir: path.join(__dirname, './userCache'),
      ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    const rawUrl = await this.search(page, selectors, url, needStyle);

    console.log(rawUrl);

    browser.close();
  }

  public async getAllUrls() {
    const urls: URL[] = [];

    const cluster = await Cluster.launch({
      puppeteer,
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 4,
      puppeteerOptions: {
        args: minimal_args,
        headless: true,
        userDataDir: path.join(__dirname, './userCache'),
        ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
        defaultViewport: { width: 1920, height: 1080 },
      },
      monitor: true,
      retryLimit: 1,
    });

    await cluster.task(async ({ page, data }) => {
      const { formConfiguration, resolveCaptcha, url, needStyle } = data;

      if (resolveCaptcha) {
        // resolve captcha
      }

      const urlDecoded = await this.search(page, formConfiguration, url, needStyle)
      console.log(urlDecoded);
      urls.push(urlDecoded);
    });

    for (let i = 0; i < this.configurations.length; ++i) {
      await cluster.queue(this.configurations[i]);
    }

    cluster.on('taskerror', (err, data, willRetry) => {
      if (willRetry) {
        console.warn(
          `Encountered an error while crawling ${data.url}. ${err.message}\nThis job will be retried`
        );
      } else {
        console.error(`Failed to crawl ${data.url}: ${err.message}`);
      }
    });

    await cluster.idle();
    await cluster.close();

    return urls;
  }
}

export default LocationDecoder;
