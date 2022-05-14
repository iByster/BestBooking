import {
  IFormConfiguration,
  ILocationDecoderConfiguration,
  IScraperConfiguration,
  IUserInput,
} from '../../types';

// : IScraperConfiguration
export const scraperConf: IScraperConfiguration = {
  url: 'https://www.agoda.com',

  workerType: 'Puppeteer',

  pageItemCount: 56,

  containerSelector: (containerNumber: number) => {
    return {
      query: `#contentContainer > div:nth-child(${containerNumber}) > ol`,
      itemCount: 0,
    };
  },

  itemSelector: (itemNumber: number) => {
    return {
      query: `li:nth-child(${itemNumber})`,
      itemCount: 0,
    };
  },

  priceSelector: {
    selector: {
      query: 'span.PropertyCardPrice__Value',
      itemCount: 0,
    },
    type: 'text',
  },

  startsSelect: {
    selector: {
      query: '[data-selenium="hotel-star-rating]',
      itemCount: 0,
    },
    type: 'title',
    extract: (res: string) => {
      return res.split(' ')[0];
    },
  },

  currencySelector: {
    selector: {
      query: 'span.PropertyCardPrice__Currency',
      itemCount: 0,
    },
    type: 'text',
  },

  locationNameSelector: {
    selector: {
      query: 'h3',
      itemCount: 0,
    },
    type: 'text',
  },

  linkToHotelSelector: {
    selector: {
      query: 'a',
      itemCount: 0,
    },
    type: 'link',
  },

  distanceSelector: {
    selector: {
      query: '',
      itemCount: 0,
    },
    type: 'text',
  },

  guestsSelector: {
    selector: {
      query: '',
      itemCount: 0,
    },
    type: 'text',
  },

  nightsSelector: {
    selector: {
      query: '',
      itemCount: 0,
    },
    type: 'text',
  },

  ratingSelector: {
    selector: {
      query: '',
      itemCount: 0,
    },
    type: 'text',
  }
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
