import { Hotel } from '../../entities/Hotel';
import {
  IFormConfiguration,
  ILocationDecoderConfiguration,
  IScraperConfiguration,
  IUserInput,
} from '../../types';
import {
  calculateTotalPriceInRON,
  destructureRooms,
  extractFloatFromString,
  getNights,
} from '../../utils/parseUtils';

// export const scraperConf: IScraperConfiguration = {
//   url: 'https://www.hotels.com',

//   workerType: 'RequestGraphQL',

//   pageItemCount: 50,

//   infiniteScroll: true,

//   pagination: true,

//   virtualization: true,

//   initialPaginationValue: 0,

//   ssr: false,

//   decodedURLQueryParams: false,

//   payload: true,

//   query: false,
// };

export const formConf: IFormConfiguration = {
  searchInputSelector: {
    query: '#location-field-destination',
    itemCount: 0,
  },

  searchButtonSelector: {
    query: 'button[type=submit]',
    itemCount: 0,
    buttonVisible: true,
  },

  selectInputOption: {
    query: 'li[data-stid="location-field-destination-result-item"]',
    itemCount: 0,
    buttonVisible: true,
  },

  inputButtonSelector: {
    query: 'button[data-stid="location-field-destination-menu-trigger"]',
    itemCount: 0,
    focusOn: false,
  },
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://www.hotels.com/'),
  resolveCaptcha: false,
  needStyle: false,
};

export const buildURL = (userInput: IUserInput, locationDecoderURL: URL) => {
  const { checkIn, checkOut, rooms } = userInput;
  const adults = rooms.map((b) => b.adults).join();
  const children: string[] = [];
  rooms.forEach((r, i) => {
    return r.childAges.forEach((ca) => {
      children.push(`${i + 1}_${ca}`);
    });
  });
  locationDecoderURL.searchParams.set('startDate', parseDate(checkIn));
  locationDecoderURL.searchParams.set('endDate', parseDate(checkOut));
  locationDecoderURL.searchParams.set('rooms', rooms.length.toString());
  locationDecoderURL.searchParams.set('adults', adults);
  locationDecoderURL.searchParams.set('children', children.join());

  return locationDecoderURL;
};

export const parseDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const extractData = async (
  response: any,
  userInput: IUserInput,
  decodedURL: string
) => {
  const locations = response.data.propertySearch.propertySearchListings;
  console.log('WWW.HOTELS.COM', locations.length);

  const { checkIn, checkOut, rooms, locationName } = userInput;

  const urlObject = new URL(decodedURL);

  const { adults, childAges, children } = destructureRooms(rooms);

  const nights = getNights(checkIn, checkOut);

  const res = [];
  if (locations.length > 0) {
    const currency =
      response.extensions.analytics[0].tealiumUtagData.currencyCode;
    const country = response.extensions.analytics[0].tealiumUtagData.country;

    const startsList =
      response.extensions.analytics[0].tealiumUtagData.entity.hotels.results
        .results;

    for (let i = 0; i < locations.length; ++i) {
      try {
        const loc = locations[i];
        // console.log(loc.availability.available);
        if (loc.availability.available) {
          const priceTotalRaw = loc.price.displayMessages.find((p: any) =>
            p.lineItems.find((l: any) => l.role === 'LEAD')
          ).lineItems[0].price.formatted;

          const priceNight = extractFloatFromString(
            loc.price.lead.formatted.replace(',', '')
          );

          const priceTotal = extractFloatFromString(
            priceTotalRaw.replace(',', '')
          );

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

          const stars = startsList.find(
            (s: any) => s.hotelId === parseInt(loc.id)
          ).starRating;
          // console.log(priceTotal.lineItems[0].price.formatted);
          const hotelData = {
            checkIn: checkIn,
            checkOut: checkOut,
            childAges: childAges,
            siteOrigin: urlObject.origin,
            adults: adults,
            nights: nights,
            rooms: rooms.length,
            currency,
            hotelName: loc.name,
            locationName,
            imageLink: loc.imageGallery.images[0].image.url,
            lat: loc.mapMarker.latLong.latitude,
            lon: loc.mapMarker.latLong.longitude,
            priceTotal,
            children,
            rating: stars,
            priceNight,
            priceTotalInRON,
            reviews: loc.reviews.score,
            link: loc.propertyDetailsLink.uri.value,
            country: country,
            region: loc.neighborhood,
          };

          // console.log('avaialable')

          res.push(hotelData);
        } else {
          // console.log('not avaialable')
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return res;
};

const extractLocationId = (decodedURL: string) => {
  const decodedURLObject = new URL(decodedURL);

  return decodedURLObject.searchParams.get('regionId');
};

export const buildPayload = (
  userInput: IUserInput,
  payload: any,
  decodedURL: string
) => {
  const urlObject = new URL(decodedURL);
  const locationId = Number(extractLocationId(decodedURL));

  const { checkIn, checkOut, rooms } = userInput;

  payload.variables.dateRange.checkInDate.day = checkIn.getDate();
  payload.variables.dateRange.checkInDate.month = checkIn.getMonth();
  payload.variables.dateRange.checkInDate.year = checkIn.getFullYear();

  payload.variables.dateRange.checkOutDate.day = checkOut.getDate();
  payload.variables.dateRange.checkOutDate.month = checkOut.getMonth();
  payload.variables.dateRange.checkOutDate.year = checkOut.getFullYear();

  payload.variables.destination.regionName =
    urlObject.searchParams.get('destination');
  payload.variables.destination.regionId = locationId.toString();

  const latLong = urlObject.searchParams.get('latLong')?.split(',');

  if (latLong) {
    payload.variables.destination.coordinates.latitude = parseFloat(latLong[0]);
    payload.variables.destination.coordinates.longitude = parseFloat(
      latLong[1]
    );
  } else {
    console.error('WWW.HOTELS.COM', 'latLong not found in the url');
  }

  const roomsPayload = new Array(rooms.length);

  rooms.forEach((room, i) => {
    const childrenPayload = room.childAges.map((c) => ({ age: c }));
    roomsPayload[i] = {
      adults: room.adults,
      children: childrenPayload,
    };
  });

  payload.variables.rooms = roomsPayload;

  return payload;
};

export const paginate = (payload: any, page: number) => {
  console.log(`PAGE: ${page}`);
  payload.variables.searchPagination.startingIndex = page;
  return payload;
};
