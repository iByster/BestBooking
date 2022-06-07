import { IScraperConfiguration, IUserInput } from '../types';
import puppeteer from 'puppeteer-extra';
import { minimal_args } from '../location-decoder/puppeteerGunArgs';
import path from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page } from 'puppeteer';
import runDOMJsWorker from './runDOMJsWorker';
import { PAGE_THRESHOLD } from '../consts';
puppeteer.use(StealthPlugin());

const results: any = [];

function transferData(payload: any) {
  results.push(payload);
}

function observeMutation(conf: any) {
  // const selectors = JSON.parse(conf) as IScrapeSelectors;
  // const {
  //   currencySelector,
  //   distanceSelector,
  //   guestsSelector,
  //   containerSelector,
  //   itemSelector,
  //   linkToHotelSelector,
  //   locationNameSelector,
  //   nightsSelector,
  //   priceSelector,
  //   ratingSelector,
  //   startsSelect,
  // } = selectors;
  // async function onMutationHandler(mutationsList: any) {
  //   console.log(mutationsList);
  //   for (let mutation of mutationsList) {
  //     if (mutation.addedNodes.length) {
  //       for (let node of mutation.addedNodes) {
  //         // console.log(node);
  //         if (node.classList.contains('PropertyCard__Container')) {
  //           let price, currency, link, locationName;
  //           const priceNode = node.querySelector(priceSelector.selector.query);
  //           // console.log('PRICE NODE: ', priceNode);
  //           if (priceNode) {
  //             price = priceNode.innerHTML;
  //           }
  //           const currencyNode = node.querySelector(
  //             currencySelector.selector.query
  //           );
  //           // console.log('CURRENCY NODE: ', currencyNode);
  //           if (currencyNode) {
  //             currency = currencyNode.innerHTML;
  //           }
  //           const linkNode = node.querySelector(
  //             linkToHotelSelector.selector.query
  //           );
  //           // console.log('LINK NODE: ', linkNode);
  //           if (linkNode) {
  //             link = linkNode.href;
  //           }
  //           const locationNameNode = node.querySelector(
  //             locationNameSelector.selector.query
  //           );
  //           // console.log('LOCATION NODE: ', locationNameNode);
  //           if (locationNameNode) {
  //             locationName = locationNameNode.innerHTML;
  //           }
  //           console.log({ price, currency, link, locationName });
  //           await transferData({ price, currency, link, locationName });
  //         }
  //       }
  //     }
  //   }
  // }
  // const observer = new MutationObserver(onMutationHandler);
  // const virtualListNode = document.querySelector(
  //   containerSelector.selector.query
  // );
  // observer.observe(virtualListNode!, {
  //   childList: true,
  //   subtree: true,
  //   // characterData: true,
  //   // attributeFilter: [itemSelector.selector.query],
  // });
}

const autoScroll = async (page: Page) => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });
};

const handlePage = async (
  page: Page,
  userInput: IUserInput,
  builtURL: string,
  conf: any,
  scraperConf: IScraperConfiguration,
  pageNr?: number
) => {
  let res;

  page.setDefaultNavigationTimeout(0);

  await page.goto(builtURL, { waitUntil: 'domcontentloaded' });

  await page.setRequestInterception(true);

  const {
    decodedURLQueryParams,
    infiniteScroll,
    pageItemCount,
    pagination,
    query,
    ssr,
    virtualization,
    scrapeSelectors,
    needStyle,
  } = scraperConf;

  page.on('request', (request) => {
    if (
      request.resourceType() === 'image' ||
      request.resourceType() === 'font'
    ) {
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

  await page.exposeFunction('transferData', transferData);

  let elementsInDOM = false;

  if (virtualization) {
    await page.evaluate(observeMutation, JSON.stringify({}));
  } else {
    elementsInDOM = true;
  }

  if (infiniteScroll) {
    if (
      scrapeSelectors?.showMoreSelector &&
      scrapeSelectors.noElementsSelector
    ) {
      const { showMoreSelector, noElementsSelector } = scrapeSelectors;
      while ((await page.$(noElementsSelector.selector.query)) === null) {
        await autoScroll(page);

        if ((await page.$(showMoreSelector.selector.query)) !== null) {
          await page.click(showMoreSelector.selector.query);
          await page.evaluate(() => {
            window.scroll(0, document.body.scrollHeight - 1500);
          });
        }
      }
    } else {
      console.log('no infinite scroll selectors');
    }
  }

  if (elementsInDOM) {
    const content = await page.content();
    res = await runDOMJsWorker(
      userInput,
      builtURL,
      conf,
      scraperConf,
      pageNr,
      content
    );
  } else {
  }

  return res;
};

const runPuppeteerWorker = async (
  userInput: IUserInput,
  decodedURL: string,
  conf: any,
  scraperConf: IScraperConfiguration,
  pageNr?: number
) => {
  const browser = await puppeteer.launch({
    args: minimal_args,
    headless: true,
    userDataDir: path.join(__dirname, './userCache'),
    ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();

  let builtURL = conf.buildURL(userInput, new URL(decodedURL));
  
  let hotels = [];

  if (scraperConf.pagination) {
    let pageItems = [];
    let pageNumber = pageNr || scraperConf.initialPaginationValue;
    let pageContor = 0;
    let isMore = false;

    do {
      pageItems = await handlePage(
        page,
        userInput,
        builtURL,
        conf,
        scraperConf,
        pageNr
      );

      if (pageItems.length > 0) {
        hotels.push(pageItems);
      }

      pageNumber += scraperConf.pageItemCount;
      pageContor += 1;
      builtURL = conf.paginate(builtURL, pageNumber);
    } while (
      ((await page.$(
        scraperConf.scrapeSelectors!.noElementsSelector!.selector.query
      )) === null ||
        pageItems.legth > 0) &&
      pageContor !== PAGE_THRESHOLD
    );

    if (pageItems.length > 0) {
      isMore = true;
    }

    await browser.close();
    return {
      isMore,
      payload: hotels.flat(),
    };

  } else {
    const pageItems = await handlePage(page, userInput, builtURL, conf, scraperConf, pageNr);
    hotels.push(pageItems);

    await browser.close();
    return {
      isMore: false,
      payload: hotels.flat(),
    };
  }

};

export default runPuppeteerWorker;
