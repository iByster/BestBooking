const firebaseConfig = require('./config');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore/lite');
const LocationDecoder = require('./src/utils/LocationDecoderV3/LocationDecoderV3');
const eskyConfig = require('./configurations/eSky.ro/conf');
// const buildURL = require('./src/utils/buildURL');

const main = async () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const {
    locationSelector,
    LOCATION_DECODE_ESKY_DOCUMENT,
    URL,
    defaultQueryObject,
    CONTENT_ROUTE,
  } = eskyConfig;

  const eskyLocationDecoder = new LocationDecoder(
    defaultQueryObject,
    locationSelector,
    db,
    100000,
    103000,
    URL,
    CONTENT_ROUTE,
    LOCATION_DECODE_ESKY_DOCUMENT,
    100,
  );

  eskyLocationDecoder.decode();
};

main().catch((e) => {
  console.error(e);
});
