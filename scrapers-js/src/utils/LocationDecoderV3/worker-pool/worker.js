const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const got = require('got');
const buildURL = require('../../buildURL');
const getContentByType = require('../../getContentByType');
const { parentPort, workerData, isMainThread } = require('worker_threads');

const main = async (data) => {
  if (isMainThread) {
    throw new Error('Its not a worker');
  }

  const { locationDecoder } = workerData;
  const { defaultQuery, url, route, locationSelector } = locationDecoder;
  const { invalidCodeValue, query, itemCount, getType } = locationSelector;
  let finished = false;

  const virtualConsole = new jsdom.VirtualConsole();

  // console.log(`ITERATION: ${data.i}.`);

  const urlQueryObject = {
    ...defaultQuery.args,
    [defaultQuery.id]: data.i,
  };

  const urlSafe = buildURL(url, route, urlQueryObject);
  // console.log(urlSafe);
  const response = await got(urlSafe);

  const dom = new JSDOM(response.body, { virtualConsole });

  const node = dom.window.document.querySelectorAll(query)[itemCount];
  const locationName = getContentByType(getType, node);

  if (invalidCodeValue === locationName) {
    finished = true;
  }

  parentPort.postMessage({ locationName, id: data.i });
};

parentPort.on('message', (data) => {
  main(data);
});
