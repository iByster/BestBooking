import { Hotel } from '../../entities/Hotel';
import {
  IFormConfiguration,
  ILocationDecoderConfiguration,
  IScraperConfiguration,
  IUserInput,
} from '../../types';
import { calculateTotalPriceByRoomPrice, calculateTotalPriceInRON, destructureRooms, extractCurrency, extractFloatFromString, getNights } from '../../utils/parseUtils';

export const scraperConf: IScraperConfiguration = {
  url: 'https://www.trip.com/',

  workerType: 'Puppeteer',

  pageItemCount: 25,

  initialPaginationValue: 0,

  infiniteScroll: true,

  pagination: false,

  virtualization: false,

  ssr: false,

  decodedURLQueryParams: false,

  payload: true,

  query: true,

  needStyle: false,

  scrapeSelectors: {
    showMoreSelector: {
      selector: {
        itemCount: -1,
        query: '.list-btn-more',
      },
      type: 'text',
    },

    noElementsSelector: {
      selector: {
        itemCount: -1,
        query: '.nothing',
      },
      type: 'text',
    },
  },
};

export const formConf: IFormConfiguration = {
  searchInputSelector: {
    query: '#hotels-destination',
    itemCount: 0,
  },

  searchButtonSelector: {
    query: '#searchBoxCon > div > div > ul > li.li-item.li-item-btn > div',
    itemCount: 0,
    buttonVisible: true,
  },

  selectInputOption: {
    query: '#dropList > div:nth-of-type(1)',
    itemCount: 0,
    buttonVisible: true,
  },

  inputButtonSelector: {
    query: '#hotels-destination',
    itemCount: 0,
    focusOn: false,
  },
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://www.trip.com/'),
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

  locationDecoderURL.searchParams.set('checkin', parseDate(checkIn));
  locationDecoderURL.searchParams.set('checkout', parseDate(checkOut));
  locationDecoderURL.searchParams.set('crn', rooms.length.toString());
  locationDecoderURL.searchParams.set('adult', adults.toString());
  locationDecoderURL.searchParams.set('children', children.toString());
  locationDecoderURL.searchParams.set('ages', childAges.flat().join());

  return locationDecoderURL.href;
};

export const parseDate = (date: Date) => {
  return date.toISOString().split('T')[0].split('-').join('/');
};


export const extractData = async (
  userInput: IUserInput,
  doc: Document,
  decodedURL: string
) => {
  const hotels = doc.querySelectorAll('.hotel-info');

  console.log(hotels);

  console.log('WWW.TRIP.COM', hotels.length);

  const { checkIn, checkOut, rooms, locationName } = userInput;

  const urlObject = new URL(decodedURL);

  const { adults, childAges, children } = destructureRooms(rooms);

  const nights = getNights(checkIn, checkOut);

  hotels.forEach(async (h) => {
    if (h.hasChildNodes()) {
      try {
        urlObject.pathname = h
          .querySelector('div.list-card-title > span.name')
          ?.innerHTML.toLowerCase()
          .split(' ')
          .filter((e) => e !== '-' && e !== ',')
          .join('-')!;

        const link = urlObject.href;

        let area, distanceFromLocation;

        const locations = h
          .querySelector('.position')
          ?.innerHTML.split('<span> | </span>')!;

        if (locations.length > 1) {
          area = locations[0];
          distanceFromLocation = locations[1];
        } else {
          distanceFromLocation = locations[0];
        }

        const priceRoom = extractFloatFromString(
          h.querySelector('div#meta-real-price > span > div')?.innerHTML!
        );

        const currency = extractCurrency(h.querySelector('div#meta-real-price > span > div')?.innerHTML!
          ?.toString()
          .replace(priceRoom?.toString()!, ''));

        const priceTotal = priceRoom ? calculateTotalPriceByRoomPrice(userInput, priceRoom) : undefined;

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
          nights,
          hotelName: h.querySelector('div.list-card-title > span.name')
            ?.innerHTML!,
          adults: adults,
          siteOrigin: urlObject.origin,
          checkIn: checkIn,
          checkOut: checkOut,
          rooms: rooms.length,
          childAges: childAges,
          locationName: locationName,
          country: '',
          currency,
          distanceFromLocation,
          priceRoom,
          priceTotal,
          priceTotalInRON,
          children,
          area,
          rating: h.querySelectorAll('.more-star-repeat i').length.toString(),
          reviews: h.querySelector('.score .real')?.innerHTML!,
          imageLink:
            (h.querySelector('.lf img') as HTMLImageElement | null)?.src ||
            (h.querySelector('.lf div') as HTMLImageElement | null)?.src,
          link,
        };

        await Hotel.create(hotelData).save();
      } catch (e) {
        console.log(h.querySelector('div.list-card-title > span.name')?.innerHTML);
        console.log(e);
      }
    } else {
      console.log('null value')
    }
  });
};
