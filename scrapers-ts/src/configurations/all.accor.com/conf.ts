import {
  IFormConfiguration,
  ILocationDecoderConfiguration,
  ISearchQueryParameters,
  ISearchQueryParametersAux,
  IUserInput,
} from '../../types';

export const formConf: IFormConfiguration = {
  searchInputSelector: {
    query: '#search-destination',
    itemCount: 0,
  },

  searchButtonSelector: {
    // query: 'button[type=submit]',
    query: '#bookingEngine > button.tSubmit.roundButton.roundButton--accent',
    itemCount: 0,
    buttonVisible: true,
  },

  selectInputOption: {
    query: '#destinationSuggest > li:first-child',
    itemCount: 0,
    buttonVisible: true,
  },

  acceptCookiesSelector: {
    query: '#onetrust-accept-btn-handler',
    itemCount: 0,
  },

  inputButtonSelector: {
    query: '#search-destination',
    itemCount: 0,
    focusOn: false,
  },
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://all.accor.com/usa/index.en.shtml'),
  resolveCaptcha: false,
  needStyle: true,
};

export const searchQueryParamsMap: ISearchQueryParameters = {
  // varsta copii
  checkIn: 'dateIn',
  checkOut: 'checkOut',
  adults: 'adults',
  children: 'children',
  rooms: 'rooms',
};

export const buildURL = (userInput: IUserInput, locationDecoderURL: URL) => {
  const {
    checkIn,
    checkOut,
    rooms,
  } = userInput;

  locationDecoderURL.searchParams.set('dateIn', parseDate(checkIn));
  locationDecoderURL.searchParams.set(
    'nights',
    Math.ceil(
      Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
    ).toString()
  );

  const compositions = rooms.map(r => {
    const composition = [r.adults, ...r.childAges];
    return composition.join('-');
  });

  locationDecoderURL.searchParams.set('compositions', compositions.join(','))

  return locationDecoderURL;
};

export const searchQueryParametersAux: ISearchQueryParametersAux = {
  priceCurrency: 'EUR',
};

export const parseDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};
