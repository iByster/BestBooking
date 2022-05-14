import LocationDecoder from './location-decoder/LocationDecoder';
import {
  locationDecoderConf as bookingComLocationDecoderConf,
  buildURL as bookingComBuildURL,
} from './configurations/booking.com/conf';
import { locationDecoderConf as eskyRoLocationDecoderConf, buildURL as eskyRoBuildURL, } from './configurations/esky.ro/conf';
// import { locationDecoderConf as directBookingRoLocationDecoderConf } from './configurations/directbooking.ro/conf';
import { locationDecoderConf as hotelsComLocationDecoderConf } from './configurations/hotels.com/conf';
import { locationDecoderConf as tripComLocationDecoderConf } from './configurations/trip.com/conf';
import {
  locationDecoderConf as agodaComLocationDecoderConf,
  buildURL as agodaComBuildURL,
} from './configurations/agoda.com/conf';
import {} from './configurations/agoda.com/conf';
import { locationDecoderConf as vrboComLocationDecoderConf } from './configurations/vrbo.com/conf';
// nu merge
// import { locationDecoderConf as expediaComLocationDecoderConf } from './configurations/expedia.com/conf';
import {
  locationDecoderConf as allAccorComLocationDecoderConf,
  buildURL as allAccorComBuildURL,
} from './configurations/all.accor.com/conf';
import Scraper from './worker-pool/Scraper';
import { IUserInput } from './types';
import { buildUrlForScrape } from './utils/buildUrlForScrape';

const main = async () => {
  const configurations = [
    bookingComLocationDecoderConf,
    eskyRoLocationDecoderConf,
    // directBookingRoLocationDecoderConf,
    hotelsComLocationDecoderConf,
    agodaComLocationDecoderConf,
    vrboComLocationDecoderConf,
    allAccorComLocationDecoderConf,
    tripComLocationDecoderConf,
  ];

  const useInput: IUserInput = {
    locationName: 'Miercurea-Ciuc',
    checkIn: new Date(2022, 6, 13),
    checkOut: new Date(2022, 6, 16),
    rooms: [
      {
        adults: 2,
        childAges: [6, 7], 
      },
      {
        adults: 2,
        childAges: [4,8,6]
      }
    ]
  };

  // const url = new URL(
  //   'https://all.accor.com/ssr/app/accor/hotels/new-york-ny-usa/index.en.shtml?dateIn=2022-05-19&nights=4&compositions=3-4-6,2-14&stayplus=false&snu=false&destination=new-york-ny-usa'
  // );
  // const url = new URL('https://www.agoda.com/search?city=2366&locale=en-us&ckuid=5ed6e5cb-8f91-4e76-acef-2149898826d9&prid=0&currency=EUR&correlationId=965c11cc-84b8-4d0e-bf58-b011cb5cfd92&pageTypeId=103&realLanguageId=1&languageId=1&origin=RO&cid=-1&userId=5ed6e5cb-8f91-4e76-acef-2149898826d9&whitelabelid=1&loginLvl=0&storefrontId=3&currencyId=1&currencyCode=EUR&htmlLanguage=en-us&cultureInfoName=en-us&machineName=main-74ffdc4c78-bv5mt&trafficGroupId=4&sessionId=zwwpsbek0a5eqbu0z3vtr2vg&trafficSubGroupId=4&aid=130243&useFullPageLogin=true&cttp=4&isRealUser=true&mode=production&checkIn=2022-07-12&checkOut=2022-07-15&rooms=2&adults=4&children=5&childages=6%2C7%2C4%2C8%2C6&priceCur=EUR&los=3&textToSearch=Berlin&travellerType=2&familyMode=off&productType=-1');
  // const url = new URL(
  //   'https://www.booking.com/searchresults.html?ss=Baile+Felix&ssne=Baile+Felix&ssne_untouched=Baile+Felix&label=gen173nr-1FCAEoggI46AdIM1gEaMABiAEBmAExuAEXyAEM2AEB6AEB-AECiAIBqAIDuALd_u-TBsACAdICJGE3ZjFkZmIyLWJiOWItNGMwYi04MDBkLTcyZTcwYTE2Nzk1M9gCBeACAQ&sid=707ada3d0c749f426fff27b059cbca16&aid=304142&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_id=900040016&dest_type=city&checkin=2022-05-14&checkout=2022-05-17&group_adults=2&no_rooms=1&group_children=3&age=7&age=4&age=1&sb_travel_purpose=leisure'
  // );
  const url = new URL('https://www.esky.ro/cazare/search?arrivalLat=46.3692&arrivalLon=25.8096&arrivalCode=35961&arrivalType=city&rangeStartDate=2022-05-12&rangeEndDate=2022-05-12&isFlexSearch=false&stayLength=2,2&rooms[0][adults]=2&rooms[0][childrenAges]=4,3&rooms[1][adults]=2&rooms[1][childrenAges]=4,1,2&source=QSF&token=70a2164f-ee53-4ecc-aa1c-2385c88ad979');

  console.log(url);
  // const url =
  const ld = new LocationDecoder(
    configurations,
    'Berlin',
  )

  const ldURL = await ld.getOneUrl(
    eskyRoLocationDecoderConf.url,
    eskyRoLocationDecoderConf.formConfiguration,
    eskyRoLocationDecoderConf.needStyle
  );

  console.log(ldURL);

  const builtURL = eskyRoBuildURL(useInput, ldURL);
  console.log(builtURL);

  // const builtUrl = await buildUrlForScrape(
  //   useInput,
  //   bookingComSearchQueryParamsMap,
  //   url,
  //   bookingComParseDate
  // );

  // for(let pair of url.searchParams.entries()) {
  //   console.log(typeof pair[0]);
  //   console.log(typeof pair[1]);
  // }


  // const mockURLS = [
  //   new URL('https://www.trip.com/'),
  //   new URL('https://www.agoda.com/'),
  //   new URL('https://www.hotels.com/'),
  //   new URL('https://www.vrbo.com/'),
  //   new URL('https://www.directbooking.ro/ro.aspx'),
  //   new URL('https://www.booking.com/'),
  // ]

  // // const urls = await ld.getAllUrls();

  // const scraper = new Scraper(mockURLS);

  // console.time('Timer');
  // const titles = await scraper.scrape();
  // console.timeEnd('Timer');

  // console.log(titles);
};

main().catch((e) => console.log(e));
