const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const {
  defaultQueryObject: defaultQuery,
  locationSelector,
  URL,
  CONTENT_ROUTE: route,
  LOCATION_DECODE_ESKY_DOCUMENT,
  codeInterval,
} = require('../../../configurations/eSky.ro/conf');
const fs = require('fs');
const got = require('got');
const buildURL = require('../buildURL');
const path = require('path');

function appendToFile(locations) {
  let locationsjson = fs.readFileSync(
    path.join(__dirname, 'eskyCode.json'),
    'utf-8'
  );
  const locationsParsed = JSON.parse(locationsjson);
  locationsParsed.push(locations);
  locationsjson = JSON.stringify(locationsParsed);
  fs.writeFileSync(
    path.join(__dirname, 'eskyCode.json'),
    locationsjson,
    'utf-8'
  );
}

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

const main = async () => {
  const virtualConsole = new jsdom.VirtualConsole();

  let locations = [];

  for (let i = codeInterval[0]; i < codeInterval[1]; ++i) {
    const urlQueryObject = {
      ...defaultQuery.args,
      [defaultQuery.id]: i,
    };

    const urlSafe = buildURL(URL, route, urlQueryObject);
    const response = await got(urlSafe);

    const dom = new JSDOM(response.body, { virtualConsole });
    const locationName = dom.window.document.querySelector('title').textContent;

    locations.push({ locationName, id: i });
  }

  writeToFile(locations);
};

main().catch((e) => console.log(e));
