import LocationDecoder from './location-decoder/LocationDecoder';
import {
  locationDecoderConf as bookingComLocationDecoderConf,
  buildURL as bookingComBuildURL,
} from './configurations/booking.com/conf';
import {
  locationDecoderConf as eskyRoLocationDecoderConf,
  buildURL as eskyRoBuildURL,
} from './configurations/esky.ro/conf';
// import { locationDecoderConf as directBookingRoLocationDecoderConf } from './configurations/directbooking.ro/conf';
import {
  locationDecoderConf as hotelsComLocationDecoderConf,
  buildURL as hotelsComBuildURL,
} from './configurations/hotels.com/conf';
import {
  locationDecoderConf as tripComLocationDecoderConf,
  buildURL as tripComBuildURL,
} from './configurations/trip.com/conf';
import {
  locationDecoderConf as agodaComLocationDecoderConf,
  buildURL as agodaComBuildURL,
  scraperConf as agodaComScrapeConf,
} from './configurations/agoda.com/conf';
import { locationDecoderConf as vrboComLocationDecoderConf } from './configurations/vrbo.com/conf';
// nu merge
// import { locationDecoderConf as expediaComLocationDecoderConf } from './configurations/expedia.com/conf';
import {
  locationDecoderConf as allAccorComLocationDecoderConf,
  buildURL as allAccorComBuildURL,
} from './configurations/all.accor.com/conf';
import Scraper from './worker-pool/Scraper';
import { ILocationDecoderConfiguration, IUserInput } from './types';
import { buildUrlForScrape } from './utils/buildUrlForScrape';
import DropPoint from './type-orm.config';
import LocationDecoderURLService from './services/LocationDecoderURLService';
import { calculateTotalPriceInRON } from './utils/parseUtils';
import HotelService from './services/HotelService';

const main = async () => {
  await DropPoint.initialize();

  const configurations = [
    // bookingComLocationDecoderConf,
    // hotelsComLocationDecoderConf,
    // agodaComLocationDecoderConf,
    tripComLocationDecoderConf,
    // eskyRoLocationDecoderConf,
    // directBookingRoLocationDecoderConf,
    // vrboComLocationDecoderConf,
    // allAccorComLocationDecoderConf,
  ];

  const userInput: IUserInput = {
    locationName: 'Brasov',
    checkIn: new Date(2022, 7, 4),
    checkOut: new Date(2022, 7, 8),
    rooms: [
      {
        adults: 1,
        childAges: [2, 2],
      },
    ],
  };

  const hotelService = new HotelService();

  console.log(await hotelService.getHotelsByUserInput(userInput, {}));

  // const locationDecoderURLService = new LocationDecoderURLService();

  // const decodedURLs: URL[] = [];
  // const neededConf: ILocationDecoderConfiguration[] = [];

  // for (let i = 0; i < configurations.length; ++i) {
  //   const res = await locationDecoderURLService.checkIfLocationIdStored(
  //     // TODO should check if created_at is up-to-date
  //     userInput.locationName,
  //     configurations[i].url.origin
  //   );

  //   if (res) {
  //     decodedURLs.push(new URL(res.extractedURL));
  //   } else {
  //     neededConf.push(configurations[i]);
  //   }
  // }

  // if (neededConf.length > 0) {
  //   const locationDecoder = new LocationDecoder(neededConf, userInput.locationName);
  //   const extractedURLs = await locationDecoder.getAllUrls();
  //   decodedURLs.push(...extractedURLs);
  // }

  // const scraper = new Scraper(userInput, decodedURLs);
  // await scraper.scrape();
};

main().catch((e) => console.log(e));
