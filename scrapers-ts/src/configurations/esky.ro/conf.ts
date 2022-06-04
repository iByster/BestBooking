import {
  IFormConfiguration,
  ILocationDecoderConfiguration,
  IUserInput,
} from '../../types';

export const formConf: IFormConfiguration = {
  searchInputSelector: {
    query:
      'body > hot-app > ng-component > div > div > esky-search-form > esky-oneway-roundtrip-form > form > section > fieldset.trip-destinations > div > esky-popular-places > span > esky-new-autocomplete-picker > div.picker-container > esky-new-autocomplete-topbar > div > esky-new-autocomplete-input > div > div > input',
    itemCount: 0,
  },

  searchButtonSelector: {
    query: 'button[type=submit]',
    itemCount: 0,
    buttonVisible: true,
  },

  selectInputOption: {
    query:
      'body > hot-app > ng-component > div > div > esky-search-form > esky-oneway-roundtrip-form > form > section > fieldset.trip-destinations > div > esky-popular-places > span > esky-new-autocomplete-picker > div.picker-container > div > esky-new-autocomplete-section > esky-new-autocomplete-hints-list > esky-new-autocomplete-hint > div > span',
    itemCount: 0,
    buttonVisible: true,
  },

  acceptCookiesSelector: {
    query:
      '#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay > div > button:nth-child(1) > span',
    itemCount: 0,
  },

  inputButtonSelector: {
    query:
      'body > hot-app > ng-component > div > div > esky-search-form > esky-oneway-roundtrip-form > form > section > fieldset.trip-destinations > div > esky-popular-places > span > esky-new-autocomplete-input > div > div',
    itemCount: 0,
    focusOn: false,
  },
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL(
    'https://www.esky.ro/cazare/search?arrivalLat=46.3692&arrivalLon=25.8096&arrivalCode=35961&arrivalType=city&rangeStartDate=2022-06-13&rangeEndDate=2022-06-13&isFlexSearch=false&stayLength=11,11&rooms[0][adults]=2&token=b04f212a-cfe1-43fc-853d-603aed6c947f'
  ),
  resolveCaptcha: false,
  needStyle: false,
};

export const buildURL = (userInput: IUserInput, locationDecoderURL: URL) => {
  const { checkIn, checkOut, rooms } = userInput;

  locationDecoderURL.searchParams.set('rangeStartDate', parseDate(checkIn));
  locationDecoderURL.searchParams.set('rangeEndDate', parseDate(checkOut));
  locationDecoderURL.searchParams.set('no_rooms', rooms.length.toString());
  rooms.forEach((r, i) => {
    locationDecoderURL.searchParams.set(
      `rooms[${i}][adults]`,
      r.adults.toString()
    );
    locationDecoderURL.searchParams.set(
      `rooms[${i}][childrenAges]`,
      r.childAges.join()
    );
  });
  const nights = Math.ceil(
    Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
  );

  const nightsFormat = Array(rooms.length).fill(nights);

  locationDecoderURL.searchParams.set('stayLength', nightsFormat.join());

  return locationDecoderURL;
};

export const parseDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};
