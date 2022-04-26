const { Cluster } = require('puppeteer-cluster');
const minimal_args = require('./pupeeterGunConfig');
const buildURL = require('../buildURL');

console.log('aici');

class LocationDecoder {
  constructor(
    defaultQuery,
    locationSelector,
    db,
    maxCode,
    minCode,
    url,
    route,
    document
  ) {
    this.defaultQuery = defaultQuery;
    this.locationSelector = locationSelector;
    this.db = db;
    this.minCode = minCode;
    this.maxCode = maxCode;
    this.url = url;
    this.route = route;
    this.document = document;
    this.nrOfWorkers = 4;
  }

  async task(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const { query, getType, itemCount } = this.locationSelector;

    try {
      await page.waitForSelector(query, { timeout: 3000 });
    } catch (e) {
      console.log('REALOAD');
      await page.goto(url, { waitUntil: 'load' });
    }

    const locationName = await page.evaluate(
      (query, getType, itemCount, GET_TYPE_INPUT) => {
        let queryNode = document.querySelectorAll(query)[itemCount];

        if (getType === GET_TYPE_INPUT) {
          return queryNode.value;
        }

        return queryNode.innerText;
      },
      query,
      getType,
      itemCount,
      GET_TYPE_INPUT
    );

    return locationName;
  }

  async decode() {
    const {
      minCode,
      maxCode,
      db,
      document,
      defaultQuery,
      url,
      route,
      locationSelector,
      nrOfWorkers,
    } = this;

    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: nrOfWorkers,
      puppeteerOptions: {
        args: minimal_args,
        headless: true,
        userDataDir: './userCache',
      },
    });

    const locations = [];

    await cluster.task(async ({ page, data }) => {
      const { url, id } = data;
      const res = await this.task(page, url);
      locations.push({location: res, id});
    });

    for (let i = minCode; i < maxCode; ++i) {
      const urlQueryObject = {
        ...defaultQuery.args,
        [defaultQuery.id]: id,
      };

      const urlSafe = buildURL(url, route, urlQueryObject);
      cluster.queue({url: urlSafe, id: i});
    }

    await cluster.idle();
    console.log(locations);
    await cluster.close();
  }
}

module.exports = LocationDecoder;
