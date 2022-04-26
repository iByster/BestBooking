const buildURL = require('../buildURL');
const {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} = require('firebase/firestore/lite');
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
    minCode,
    maxCode,
    url,
    route,
    document,
    nrOfWorkers
  ) {
    this.defaultQuery = defaultQuery;
    this.locationSelector = locationSelector;
    this.db = db;
    this.minCode = minCode;
    this.maxCode = maxCode;
    this.url = url;
    this.route = route;
    this.document = document;
    this.nrOfWorkers = 8;
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

    const steps = maxCode - minCode + 1;
    const chunksLen = Math.floor(steps / nrOfWorkers);
    const remaingSteps = steps % nrOfWorkers;
    const workers = [];

    const locations = [];

    for (let i = 0; i < nrOfWorkers; ++i) {
      let remaining = i === nrOfWorkers - 1 ? remaingSteps : 0;

      workers.push(
        new Worker(__dirname + '/worker.js', {
          workerData: {
            minCode: minCode + chunksLen * i,
            maxCode: minCode + chunksLen * (i + 1) + remaining,
            threadNr: i,
            locationDecoder: {
              defaultQuery,
              url,
              route,
              locationSelector,
            },
          },
        })
      );

      workers[i].once('message', (message) => {
        locations.push(message);
      });

      // await setDoc(doc(db, 'Rates', currDate), {
      //   rates: JSON.stringify(message),
      // });
    }
    console.log(locations);
  }
}

module.exports = LocationDecoder;
