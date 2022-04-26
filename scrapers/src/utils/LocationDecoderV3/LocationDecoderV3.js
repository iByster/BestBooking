const {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} = require('firebase/firestore/lite');
const WorkerPool = require('./worker-pool/WorkerPool');
const path = require('path');
const fs = require('fs');

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
    this.nrOfWorkers = nrOfWorkers;
  }

  range(start, end) {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  }

  writeToFile(data) {
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

    const pool = new WorkerPool(
      path.join(__dirname, 'worker-pool', 'worker.js'),
      nrOfWorkers,
      {
        locationDecoder: {
          defaultQuery,
          url,
          route,
          locationSelector,
        },
      }
    );

    const locations = [];

    Promise.all(
      this.range(minCode, maxCode).map(async (i) => {
        const res = await pool.run(() => ({ i }));
        locations.push(res);
        console.log('finished', i, res);
      })
    ).then(() => {
      console.log('finished all');
      this.writeToFile(locations);
    });
  }
}

module.exports = LocationDecoder;
