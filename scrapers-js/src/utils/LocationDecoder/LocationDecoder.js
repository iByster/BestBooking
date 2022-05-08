const puppeteer = require('puppeteer');
const { GET_TYPE_INPUT } = require('../../consts');
const buildURL = require('../buildURL');
const {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} = require('firebase/firestore/lite');
const minimal_args = require('./pupeeterGunConfig');
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require('worker_threads');

class LocationDecoder {
  constructor(
    defaultQuery,
    locationSelector,
    db,
    maxCode,
    url,
    route,
    document
  ) {
    this.defaultQuery = defaultQuery;
    this.locationSelector = locationSelector;
    this.db = db;
    this.minCode = 99999;
    this.maxCode = maxCode;
    this.url = url;
    this.route = route;
    this.document = document;
    this.nrOfWorkers = 4;
  }

  static async getLocationNameById(url, page) {
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

  async getAllLocationNames() {
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

    const browser = await puppeteer.launch({
      args: minimal_args,
      headless: true,
      userDataDir: './userCache',
    });

    // const locations = {};

    // let foundMinLimit = false;
    // let triesBeforeQuit = 10000;

    const steps = maxCode - minCode + 1;
    const chunksLen = Math.floor(steps / nrOfWorkers);
    const remaingSteps = steps % nrOfWorkers;
    const workers = [];

    for (let i = 0; i < nrOfWorkers; ++i) {
      let remaining = i === nrOfWorkers - 1 ? remaingSteps : 0;
      let page = await browser.newPage();

      workers.push(
        new Worker(__dirname + '/worker.js', {
          workerData: {
            minIndex: minCode + chunksLen * i,
            maxIndex: minCode + chunksLen * (i + 1) + remaining,
            threadNr: i,
            locationDecoder: {
              defaultQuery,
              url,
              route,
              locationSelector,
            },
            newPage: browser.newPage,
          },
        })
      );
    }

  //     // TODO maybe while?
  //     for (let id = minCode; id < maxCode; ++id) {
  //       console.log('Searching...');

        // const urlQueryObject = {
        //   ...defaultQuery.args,
        //   [defaultQuery.id]: id,
        // };

        // const urlSafe = buildURL(url, route, urlQueryObject);
  //       const locationName = await this.getLocationNameById(urlSafe, page);

  //       // found higher limit
  //       if (locationName === locationSelector.invalidCodeValue && foundMinLimit) {
  //         console.log('TRYING TO QUIT...', triesBeforeQuit);
  //         triesBeforeQuit--;

  //         // TODO update higher bound

  //         if (triesBeforeQuit === 0) {
  //           break;
  //         }
  //       }

  //       // found lower limit
  //       if (locationName !== locationSelector.invalidCodeValue) {
  //         foundMinLimit = true;
  //         // TODO should save lower limit
  //         console.log('Found location: ' + locationName + ' with the id: ' + id);
  //         locations[locationName] = id;
  //       }
  //     }

  //     let date = new Date();
  //     let currDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

  //     await setDoc(doc(db, document, currDate), {
  //       locations: JSON.stringify(locations),
  //     });
      await browser.close();
  }
}

module.exports = LocationDecoder;
