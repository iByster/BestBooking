import LocationDecoder from './location-decoder/LocationDecoder';
import { formConf as bookingComFormConf } from './configurations/booking.com/conf';
import { formConf as eskyRoFormConf } from './configurations/esky.ro/conf';

const main = async () => {
  const url = 'https://www.esky.ro/cazare/search?arrivalCode=4509&arrivalType=region&rangeStartDate=2022-05-18&rangeEndDate=2022-05-18&isFlexSearch=false&stayLength=1,1&rooms[0][adults]=2&source=QSF&token=5320e2b0-41a3-4e9a-bdff-3726b26cc1cf';


  const ld = new LocationDecoder(
       eskyRoFormConf,
      'Miercurea-Ciuc, Harghita, Romania',
      new URL(url),
  )

  ld.getLocationIdFromUrl();
};

main().catch((e) => console.log(e));
