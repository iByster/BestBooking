import LocationDecoder from './location-decoder/LocationDecoder';
import { locationDecoderConf as bookingComLocationDecoderConf } from './configurations/booking.com/conf';
import { locationDecoderConf as eskyRoLocationDecoderConf } from './configurations/esky.ro/conf';
import { locationDecoderConf as directBookingRoLocationDecoderConf } from './configurations/directbooking.ro/conf';
import { locationDecoderConf as hotelsComLocationDecoderConf } from './configurations/hotels.com/conf';
import { locationDecoderConf as tripComLocationDecoderConf } from './configurations/trip.com/conf';
import { locationDecoderConf as agodaComLocationDecoderConf } from './configurations/agoda.com/conf';
import { locationDecoderConf as vrboComLocationDecoderConf } from './configurations/vrbo.com/conf';
// nu merge
// import { locationDecoderConf as expediaComLocationDecoderConf } from './configurations/expedia.com/conf';
import { locationDecoderConf as allAccorComLocationDecoderConf } from './configurations/all.accor.com/conf';

const main = async () => {
  const configurations = [
    bookingComLocationDecoderConf,
    eskyRoLocationDecoderConf,
    directBookingRoLocationDecoderConf,
    hotelsComLocationDecoderConf,
    agodaComLocationDecoderConf,
    vrboComLocationDecoderConf,
    allAccorComLocationDecoderConf,
    tripComLocationDecoderConf,
    // expediaComLocationDecoderConf
  ]

  const ld = new LocationDecoder(
    configurations,
    'New York',
  )

  ld.getOneUrl(
    directBookingRoLocationDecoderConf.url,
    directBookingRoLocationDecoderConf.formConfiguration,
    directBookingRoLocationDecoderConf.needStyle
  );

  // console.time('Timer');
  // console.log(await ld.getAllUrls());
  // console.timeEnd('Timer');
};

main().catch((e) => console.log(e));
