import {
  IFormConfiguration,
  ILocationDecoderConfiguration,
  ISearchQueryParameters,
  ISearchQueryParametersAux,
  IUserInput,
} from '../../types';

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

export const searchQueryParamsMap: ISearchQueryParameters = {
  // varsta copii
  checkIn: 'checkIn',
  checkOut: 'checkOut',
  adults: 'adults',
  children: 'children',
  rooms: 'rooms',
};

export const buildURL = (userInput: IUserInput, locationDecoderURL: URL) => {
  const { checkIn, checkOut, rooms } = userInput;
  const adults = rooms.reduce((a, b) => a + b.adults, 0);
  const children = rooms.reduce((a, b) => a + b.childAges.length, 0);
  const childAges = rooms.map(r => {
    return r.childAges;
  });

  locationDecoderURL.searchParams.set('checkIn', parseDate(checkIn));
  locationDecoderURL.searchParams.set('checkOut', parseDate(checkOut));
  locationDecoderURL.searchParams.set('rooms', rooms.length.toString());
  locationDecoderURL.searchParams.set('adults', adults.toString());
  locationDecoderURL.searchParams.set('children', children.toString());
  locationDecoderURL.searchParams.set(
    'childages',
    String(childAges.flat()),
  );

  return locationDecoderURL;
};

export const searchQueryParametersAux: ISearchQueryParametersAux = {
  priceCurrency: 'EUR',
};

export const parseDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};
