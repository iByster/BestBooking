const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require('worker_threads');
const LocationDecoder = require('./LocationDecoder');
const buildURL = require('../buildURL');

(async () => {
  const { minIndex, maxIndex, threadNr, locationDecoder, newPage } = workerData;

  const { defaultQuery, url, route, locationSelector } = locationDecoder;

  console.log(threadNr);
  // console.log(workers[threadNr].threadId);
  console.log(minIndex, maxIndex);

  const locations = {};

  // let foundMinLimit = false;
  let triesBeforeQuit = 10000;

  // const browser = await puppeteer.launch({
  //     args: minimal_args,
  //     headless: true,
  //     userDataDir: './userCache',
  //   });
  //   // const page = await browser.newPage();

  const page = await newPage();

  for (let id = minIndex; id < maxIndex; ++id) {
    console.log(`Worker${threadNr} is searching...`);

    const urlQueryObject = {
      ...defaultQuery.args,
      [defaultQuery.id]: id,
    };

    const urlSafe = buildURL(url, route, urlQueryObject);
    const locationName = await LocationDecoder.getLocationNameById(
      urlSafe,
      page
    );

    // found higher limit
    if (locationName === locationSelector.invalidCodeValue) {
      console.log('TRYING TO QUIT...', triesBeforeQuit);
      triesBeforeQuit--;

      // TODO update higher bound

      if (triesBeforeQuit === 0) {
        break;
      }
    }

    // found lower limit
    if (locationName !== locationSelector.invalidCodeValue) {
      //   foundMinLimit = true;
      // TODO should save lower limit
      console.log('Found location: ' + locationName + ' with the id: ' + id);
      locations[locationName] = id;
    }
  }

  console.log(`Worker${threadNr}`, locations);
})();
