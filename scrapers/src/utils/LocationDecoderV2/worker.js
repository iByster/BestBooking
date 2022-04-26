const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const got = require('got');
const buildURL = require('../buildURL');
const getContentByType = require('../getContentByType');
const { parentPort, workerData, isMainThread } = require('worker_threads');

const main = async () => {
  if (isMainThread) {
    throw new Error('Its not a worker');
  }

  const { minCode, maxCode, threadNr, locationDecoder } = workerData;
  const { defaultQuery, url, route, locationSelector } = locationDecoder;
  const { invalidCodeValue, query, itemCount, getType } = locationSelector;
  let finished = false;

  const virtualConsole = new jsdom.VirtualConsole();

  let locations = [];

  for (let i = minCode; i < maxCode && !finished; ++i) {
    console.log(`WORKER: ${threadNr} ITERATION: ${i}.`);

    const urlQueryObject = {
      ...defaultQuery.args,
      [defaultQuery.id]: i,
    };

    const urlSafe = buildURL(url, route, urlQueryObject);
    const response = await got(urlSafe);

    const dom = new JSDOM(response.body, { virtualConsole });

    const node = dom.window.document.querySelectorAll(query)[itemCount];
    const locationName = getContentByType(getType, node);

    locations.push({ locationName, id: i });

    if (invalidCodeValue === locationName) {
      finished = true;
    }
  }

  parentPort.postMessage(locations);
};

main();
