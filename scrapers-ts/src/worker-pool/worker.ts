import jsdom, { JSDOM } from 'jsdom';
import got from 'got';
import { IScraperConfiguration, WorkerPayload } from '../types';
const { parentPort, isMainThread } = require('worker_threads');
import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import { minimal_args } from '../location-decoder/puppeteerGunArgs';
import path from 'path';
import { scraperConf as agodaComScraper } from '../configurations/agoda.com/conf';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page } from 'puppeteer';
puppeteer.use(StealthPlugin());

const configurations = [agodaComScraper];

const withInfiniteScroll = async (
  page: Page,
  extractItems: string,
  itemCount: number,
  scrollDelay = 800
) => {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitForTimeout(scrollDelay);
    }
  } catch (e) {}
  return items;
};

const runDOMJsWorker = async (url: string) => {
  if (isMainThread) {
    throw new Error('Its not a worker');
  }

  const virtualConsole = new jsdom.VirtualConsole();

  const response = await got(url);

  fs.writeFileSync(path.join(__dirname, 'out.html'), response.body);

  const dom = new JSDOM(response.body, { virtualConsole });

  const node = dom.window.document.title;

  parentPort.postMessage({ title: node });
};

const runPuppeteerWorker = async (url: string, conf: IScraperConfiguration) => {
  if (isMainThread) {
    throw new Error('Its not a worker');
  }

  const browser = await puppeteer.launch({
    args: minimal_args,
    headless: true,
    userDataDir: path.join(__dirname, './userCache'),
    ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();

  // await page.setRequestInterception(true);
  await page.setDefaultNavigationTimeout(0);

  // page.on('request', (request) => {
  //   if (
  //     request.resourceType() === 'image' ||
  //     request.resourceType() === 'font'
  //     // request.resourceType() === 'stylesheet'
  //   ) {
  //     request.abort();
  //   } else {
  //     request.continue();
  //   }
  // });

  await page.goto(url, { waitUntil: 'networkidle2' });

  await withInfiniteScroll(
    page,
    conf.priceSelector.selector.query,
    conf.pageItemCount
  );

  const content = await page.content();

  fs.writeFileSync(path.join(__dirname, 'out.html'), content);
  console.log('aici');

  browser.close();

  parentPort.postMessage({ title: '' });
};

parentPort.on('message', (data: WorkerPayload) => {
  const { url } = data;

  const conf = configurations.find((c) => url.includes(c.url));

  if (conf) {
    if (conf.workerType === 'Puppeteer') {
      runPuppeteerWorker(url, conf);
    } else {
      runDOMJsWorker(url);
    }
  } else {
    console.log('No configuration was found');
  }
});
