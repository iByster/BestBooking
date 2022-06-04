import {
  IFormConfiguration,
  IGraphQLScraperConfiguration,
  ILocationDecoderConfiguration,
  IScraperConfiguration,
  IUserInput,
} from '../../types';

import { Hotel } from '../../entities/Hotel';
import { calculateTotalPriceInRON, destructureRooms, getNights } from '../../utils/parseUtils';

// : IScraperConfiguration
export const scraperConf: IScraperConfiguration = {
  url: 'https://www.agoda.com',

  workerType: 'RequestGraphQL',

  pageItemCount: 1,

  infiniteScroll: true,

  pagination: true,

  virtualization: true,

  initialPaginationValue: 1,

  ssr: false,

  decodedURLQueryParams: false,

  payload: true,

  query: false,
};

const formConf: IFormConfiguration = {
  searchInputSelector: {
    query:
      '#SearchBoxContainer > div.Box-sc-kv6pi1-0.bpOVsR.TabContent.OpaqueBackground > div > div.Box-sc-kv6pi1-0.hRUYUu > div > div > div.IconBox.IconBox--autocomplete > div > div > input',
    itemCount: 0,
  },

  searchButtonSelector: {
    query:
      '#SearchBoxContainer > div.Box-sc-kv6pi1-0.hRUYUu.TabContent__Search--button > button',
    itemCount: 0,
    buttonVisible: false,
  },

  selectInputOption: {
    query:
      '#SearchBoxContainer > div.Box-sc-kv6pi1-0.bpOVsR.TabContent.OpaqueBackground > div > div.Box-sc-kv6pi1-0.hRUYUu > div > div > div.Popup__container.Popup__container--garage-door > div > div > ul > li:nth-child(1)',
    itemCount: 0,
    buttonVisible: true,
  },

  acceptCookiesSelector: {
    query:
      'body > div.ab-iam-root.v3.ab-animate-in.ab-animate-out.ab-effect-modal.ab-show > div.ab-in-app-message.ab-background.ab-modal-interactions.ab-modal.ab-centered > div.ab-message-buttons > button:nth-child(2)',
    itemCount: 0,
  },

  inputButtonSelector: {
    query:
      '#SearchBoxContainer > div.Box-sc-kv6pi1-0.bpOVsR.TabContent.OpaqueBackground > div > div.Box-sc-kv6pi1-0.hRUYUu > div > div > div.IconBox.IconBox--autocomplete > div > div > input',
    itemCount: 0,
    focusOn: false,
  },
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://www.agoda.com/'),
  resolveCaptcha: false,
  needStyle: true,
};

export const buildURL = (userInput: IUserInput, locationDecoderURL: URL) => {
  const { checkIn, checkOut, rooms } = userInput;
  const adults = rooms.reduce((a, b) => a + b.adults, 0);
  const children = rooms.reduce((a, b) => a + b.childAges.length, 0);
  const childAges = rooms.map((r) => {
    return r.childAges;
  });

  locationDecoderURL.searchParams.set('checkIn', parseDate(checkIn));
  locationDecoderURL.searchParams.set('checkOut', parseDate(checkOut));
  locationDecoderURL.searchParams.set('rooms', rooms.length.toString());
  locationDecoderURL.searchParams.set('adults', adults.toString());
  locationDecoderURL.searchParams.set('children', children.toString());
  locationDecoderURL.searchParams.set('childages', String(childAges.flat()));

  return locationDecoderURL;
};

export const parseDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const extractLocationId = (decodedURL: string) => {
  const decodedURLObject = new URL(decodedURL);

  return decodedURLObject.searchParams.get('city');
};

export const buildPayload = (
  userInput: IUserInput,
  payload: any,
  decodedURL: string
) => {
  const locationId = Number(extractLocationId(decodedURL));

  const { checkIn, checkOut, rooms } = userInput;

  const adults = rooms.reduce((a, b) => a + b.adults, 0);
  const children = rooms.reduce((a, b) => a + b.childAges.length, 0);
  const childAges = rooms
    .map((r) => {
      return r.childAges;
    })
    .flat();

  payload.variables.CitySearchRequest.cityId = locationId;
  payload.variables.CitySearchRequest.searchRequest.searchCriteria.adults =
    adults;
  payload.variables.CitySearchRequest.searchRequest.searchCriteria.children =
    children;
  payload.variables.CitySearchRequest.searchRequest.searchCriteria.rooms =
    rooms.length;
  payload.variables.CitySearchRequest.searchRequest.searchCriteria.children =
    children;
  payload.variables.CitySearchRequest.searchRequest.searchCriteria.childAges =
    childAges;
  payload.variables.CitySearchRequest.searchRequest.searchCriteria.bookingDate =
    new Date().toISOString();
  payload.variables.CitySearchRequest.searchRequest.searchCriteria.checkInDate =
    checkIn.toISOString();
  payload.variables.CitySearchRequest.searchRequest.searchCriteria.localCheckInDate =
    parseDate(checkIn);
  payload.variables.CitySearchRequest.searchRequest.flexibleSearchRequest.fromDate =
    parseDate(checkIn);
  payload.variables.CitySearchRequest.searchRequest.flexibleSearchRequest.toDate =
    parseDate(checkOut);
  payload.variables.ContentSummaryRequest.context.searchCriteria.cityId =
    locationId;
  payload.variables.ContentSummaryRequest.context.occupancy.numberOfAdults =
    adults;
  payload.variables.ContentSummaryRequest.context.occupancy.numberOfChildren =
    children;
  payload.variables.PricingSummaryRequest.pricing.bookingDate =
    new Date().toISOString();
  payload.variables.PricingSummaryRequest.pricing.checkIn =
    checkIn.toISOString();
  payload.variables.PricingSummaryRequest.pricing.checkout =
    checkOut.toISOString();
  payload.variables.PricingSummaryRequest.pricing.localCheckInDate =
    parseDate(checkIn);
  payload.variables.PricingSummaryRequest.pricing.localCheckoutDate =
    parseDate(checkOut);
  payload.variables.PricingSummaryRequest.pricing.occupancy.adults = adults;
  payload.variables.PricingSummaryRequest.pricing.occupancy.children = children;
  payload.variables.PricingSummaryRequest.pricing.occupancy.childAges =
    childAges;
  payload.variables.PricingSummaryRequest.pricing.occupancy.rooms =
    rooms.length;

  return payload;
};

export const extractData = async (
  response: any,
  userInput: IUserInput,
  decodedURL: string
) => {
  const { properties } = response.data.citySearch;
  const urlObject = new URL(decodedURL);

  const { checkIn, checkOut, rooms, locationName } = userInput;

  const { adults, childAges, children } = destructureRooms(rooms);

  const nights = getNights(checkIn, checkOut);

  console.log('WWW.AGODA.COM', properties.length);
  // console.log('WWW.AGODA.COM', console.log(properties));

  if (properties.length > 0) {
    for (let i = 0; i < properties.length; ++i) {
      if (properties[i].pricing.offers.length > 0) {
        try {
          urlObject.pathname =
            properties[
              i
            ].content.informationSummary.propertyLinks?.propertyPage;
          const link = urlObject.href;

          const priceTotal =
            properties[i].pricing.offers[0].roomOffers[0].room.pricing[0].price
              .perBook.inclusive.display;

          const currency =
            properties[i].pricing.offers[0].roomOffers[0].room.pricing[0]
              .currency;

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
            rooms: rooms.length,
            currency:
              properties[i].pricing.offers[0].roomOffers[0].room.pricing[0]
                .currency,
            hotelName: properties[i].content.informationSummary.defaultName,
            locationName,
            priceTotal:
              properties[i].pricing.offers[0].roomOffers[0].room.pricing[0]
                .price.perBook.inclusive.display,
            priceTotalInRON,
            priceNight:
              properties[i].pricing.offers[0].roomOffers[0].room.pricing[0]
                .price.perNight.inclusive.display,
            rating: properties[i].content.informationSummary.rating,
            lat: properties[i].content.informationSummary.geoInfo.latitude,
            lon: properties[i].content.informationSummary.geoInfo.longitude,
            imageLink:
              properties[i].content.images.hotelImages[0].urls[0].value,
            reviews: properties[i].content.reviews.cumulative?.score,
            link,
            children,
            country:
              properties[i].content.informationSummary.address.country.name,
            area: properties[i].content.informationSummary.address.area.name,
          };
          await Hotel.create(hotelData).save();
        } catch (e) {
          console.log(e);
        }
      }
    }
    return true;
  }

  return false;
};

export const paginate = (payload: any, page: number) => {
  console.log(`PAGE: ${page}`);
  payload.variables.CitySearchRequest.searchRequest.page.pageNumber = page;
  return payload;
};
