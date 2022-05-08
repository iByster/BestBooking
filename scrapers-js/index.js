const firebaseConfig = require('./config');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore/lite');
const LocationDecoder = require('./src/utils/LocationDecoderV4/LocationDecoderV4');
const eskyConfig = require('./configurations/eSky.ro/conf');
const bookingDotComConfig = require('./configurations/booking.com/conf');
// const buildURL = require('./src/utils/buildURL');

const main = async () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // baseUrl: 'https://www.booking.com/index.ro.html',

  console.log(bookingDotComConfig.locationDecoderConf);

  const locationDecoder = new LocationDecoder(
    bookingDotComConfig.locationDecoderConf,
    'Miercurea-Ciuc, Harghita, Romania',
    'https://www.booking.com/searchresults.html'
  );

  locationDecoder.getLocationIdFromUrl();
};

main().catch((e) => {
  console.error(e);
});
