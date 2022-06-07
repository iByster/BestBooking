import { Hotel } from '../../entities/Hotel';
import {
  IFormConfiguration,
  ILocationDecoderConfiguration,
  IScraperConfiguration,
  ISearchQueryParameters,
  ISearchQueryParametersAux,
  IUserInput,
} from '../../types';
import { calculateTotalPriceInRON, destructureRooms, getNights } from '../../utils/parseUtils';

// export const scraperConf: IScraperConfiguration = {
//   url: 'https://www.agoda.com',

//   workerType: 'RequestGraphQL',

//   pageItemCount: 25,

//   initialPaginationValue: 0,

//   infiniteScroll: false,

//   pagination: true,

//   virtualization: false,

//   ssr: true,

//   decodedURLQueryParams: true,

//   payload: true,

//   query: true,
// };

export const formConf: IFormConfiguration = {
  searchInputSelector: {
    query: '#ss',
    itemCount: 0,
  },

  searchButtonSelector: {
    query: 'button[type=submit]',
    itemCount: 0,
    buttonVisible: true,
  },

  selectInputOption: {
    query:
      // '#frm > div.xp__fieldset.js--sb-fieldset.accommodation > div.xp__input-group.xp__search > div:nth-child(11) > div.c-autocomplete.sb-destination.-with-clear.region_second_line > ul.c-autocomplete__list.sb-autocomplete__list.sb-autocomplete__list-with_photos > li:first-child',
      '#frm > div.xp__fieldset.js--sb-fieldset.accommodation > div.xp__input-group.xp__search > div:nth-child(11) > div.c-autocomplete.sb-destination.-with-clear.region_second_line > ul.c-autocomplete__list.sb-autocomplete__list.-visible > li:nth-child(1)',
    itemCount: 0,
    buttonVisible: true,
  },

  inputButtonSelector: {
    query: '#ss',
    itemCount: 0,
    focusOn: false,
  },
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://www.booking.com/'),
  resolveCaptcha: false,
  needStyle: false,
};

export const buildURL = (userInput: IUserInput, locationDecoderURL: URL) => {
  const { checkIn, checkOut, rooms } = userInput;
  const adults = rooms.reduce((a, b) => a + b.adults, 0);
  const children = rooms.reduce((a, b) => a + b.childAges.length, 0);
  const childAges = rooms
    .map((r) => {
      return r.childAges;
    })
    .flat();
  locationDecoderURL.searchParams.set('checkin', parseDate(checkIn));
  locationDecoderURL.searchParams.set('checkout', parseDate(checkOut));
  locationDecoderURL.searchParams.set('no_rooms', rooms.length.toString());
  locationDecoderURL.searchParams.set('group_adults', adults.toString());
  locationDecoderURL.searchParams.set('group_children', children.toString());
  locationDecoderURL.searchParams.delete('age');
  for (let i = 0; i < childAges.length; ++i) {
    locationDecoderURL.searchParams.append('age', childAges[i].toString());
  }

  return locationDecoderURL;
};

export const parseDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const extractLocationId = (decodedURL: string) => {
  const decodedURLObject = new URL(decodedURL);

  return decodedURLObject.searchParams.get('dest_id');
};

const extractSearchString = (decodedURL: string) => {
  const decodedURLObject = new URL(decodedURL);

  return decodedURLObject.searchParams.get('ss');
};

export const buildPayload = (
  userInput: IUserInput,
  payload: any,
  decodedURL: string
) => {
  const locationId = Number(extractLocationId(decodedURL));
  const objURL = new URL(decodedURL);

  const { checkIn, checkOut, rooms } = userInput;

  const adults = rooms.reduce((a, b) => a + b.adults, 0);
  const children = rooms.reduce((a, b) => a + b.childAges.length, 0);
  const childAges = rooms
    .map((r) => {
      return r.childAges;
    })
    .flat();

  payload.variables.input.childrenAges = childAges;
  payload.variables.input.dates.checkin = parseDate(checkIn);
  payload.variables.input.dates.checkout = parseDate(checkOut);
  payload.variables.input.location.destId = locationId;
  payload.variables.input.location.searchString =
    extractSearchString(decodedURL);
  payload.variables.input.nbAdults = adults;
  payload.variables.input.nbChildren = children;
  payload.variables.input.nbRooms = rooms.length;
  payload.variables.input.rawQueryForSession = `${objURL.pathname}${objURL.search}`;

  return payload;
};

export const extractData = async (
  response: any,
  userInput: IUserInput,
  decodedURL: string
) => {
  const { results, breadcrumbs } = response.data.search;
  // console.log(results);
  const urlObject = new URL(decodedURL);

  const { checkIn, checkOut, rooms, locationName } = userInput;

  const { adults, childAges, children } = destructureRooms(rooms);

  const nights = getNights(checkIn, checkOut);

  let country, city, region;

  breadcrumbs.forEach((c: any) => {
    if (c.destType === 'COUNTRY') {
      country = c.name;
    }
    if (c.destType === 'REGION') {
      region = c.name;
    }
    if (c.destType === 'CITY') {
      city = c.name;
    }
  });

  console.log('WWW.BOOKING.COM', results.length);

  const res = [];

  if (results.length > 0) {
    for (let i = 0; i < results.length; ++i) {
      try {
        urlObject.pathname = results[i].basicPropertyData?.pageName;
        const link = urlObject.href;

        const priceTotal = parseFloat(
          results[i].priceDisplayInfo.displayPrice.amountPerStay.amountRounded
            .split(' ')[0]
            .replace(',', '')
        );

        const currency = results[i].blocks[0].originalPrice.currency;

        let priceTotalInRON = undefined;

        if (priceTotal) {
          if (currency !== 'RON') {
            priceTotalInRON = await calculateTotalPriceInRON(
              priceTotal,
              currency
            );
          } else {
            priceTotalInRON = priceTotal;
          }
        }

        const hotelData = {
          checkIn: checkIn,
          checkOut: checkOut,
          childAges: childAges,
          siteOrigin: urlObject.origin,
          adults: adults,
          nights: nights,
          children,
          rooms: rooms.length,
          currency: results[i].blocks[0].originalPrice.currency,
          hotelName: results[i].displayName.text,
          locationName: locationName,
          priceTotal,
          priceTotalInRON,
          rating: results[i].basicPropertyData.starRating?.value,
          distanceFromLocation: results[i].location.mainDistance,
          imageLink: `https://t-cf.bstatic.com${results[i].basicPropertyData.photos.main.highResJpegUrl.relativeUrl}`,
          reviews: results[i].basicPropertyData.reviewScore.score,
          link,
          country: country,
          address: results[i].basicPropertyData.location.address,
          region,
        };

        // console.log(hotelData);
        res.push(hotelData);
      } catch (e) {
        console.log(e);
      }
    }
  }

  return res;
};

export const paginate = (payload: any, page: number) => {
  console.log(`PAGE: ${page}`);
  payload.variables.input.pagination.offset = page;
  return payload;
};
