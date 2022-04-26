const { Cluster } = require('puppeteer-cluster');
const minimal_args = require('./pupeeterGunConfig');
const buildURL = require('../buildURL');
const {
  defaultQueryObject: defaultQuery,
  locationSelector,
  URL,
  CONTENT_ROUTE: route,
  LOCATION_DECODE_ESKY_DOCUMENT,
  codeInterval,
} = require('../../../configurations/eSky.ro/conf');
const fs = require('fs');
const path = require('path');

const { GET_TYPE_INPUT } = require('../../consts');

function writeToFile(data) {
  const sortedData = data.sort((a, b) => a.id - b.id);
  try {
    fs.writeFileSync(
      path.join(__dirname, 'eskyCode.json'),
      JSON.stringify(sortedData)
    );
  } catch (err) {
    console.error(err);
  }
}

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4,
    puppeteerOptions: {
      args: minimal_args,
      headless: true,
      userDataDir: './userCache',
    },
    monitor: true,
  });

  const locations = [];

  //   cluster.on('taskerror', (err, data, willRetry) => {
  //     if (willRetry) {
  //       console.warn(
  //         `Encountered an error while crawling ${data}. ${err.message}\nThis job will be retried`
  //       );
  //     } else {
  //       console.error(`Failed to crawl ${data}: ${err.message}`);
  //       console.error(data);
  //     }
  //   });

  await cluster.task(async ({ page, data }) => {
    const { url, id } = data;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const { query, getType, itemCount } = locationSelector;

    // await page.waitForSelector(query);
    // try {
    // } catch (e) {
    // //   console.log('REALOAD');
    //   await page.goto(url, { waitUntil: 'load' });
    // }

    // const locationName = await page.evaluate(
    //   (query, getType, itemCount, GET_TYPE_INPUT) => {
    //     let queryNode = document.querySelectorAll(query)[itemCount];

    //     if (getType === GET_TYPE_INPUT) {
    //       return queryNode.value;
    //     }

    //     return queryNode.innerText;
    //   },
    //   query,
    //   getType,
    //   itemCount,
    //   GET_TYPE_INPUT
    // );

    const locationName = await page.evaluate(() => {
      return document.title;
    });

    if (document.title !== '') {
      locations.push({ locationName, id });
    }
  });

  for (let i = codeInterval[0]; i < codeInterval[1]; ++i) {
    const urlQueryObject = {
      ...defaultQuery.args,
      [defaultQuery.id]: i,
    };

    const urlSafe = buildURL(URL, route, urlQueryObject);
    await cluster.queue({ url: urlSafe, id: i });
  }

  await cluster.idle();
  await cluster.close();

  writeToFile(locations);
})();
