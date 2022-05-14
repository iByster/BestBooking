import { IFormConfiguration, ILocationDecoderConfiguration, IUserInput } from "../../types";

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
  }
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
    formConfiguration: formConf,
    url: new URL('https://www.trip.com/'),
    resolveCaptcha: false,
    needStyle: true,
}

export const buildURL = (userInput: IUserInput, locationDecoderURL: URL) => {
  const { checkIn, checkOut, rooms } = userInput;
  const adults = rooms.reduce((a, b) => a + b.adults, 0);
  const children = rooms.reduce((a, b) => a + b.childAges.length, 0);
  const childAges = rooms.map(r => {
    return r.childAges;
  });


  locationDecoderURL.searchParams.set('checkin', parseDate(checkIn));
  locationDecoderURL.searchParams.set('checkout', parseDate(checkOut));
  locationDecoderURL.searchParams.set('crn', rooms.length.toString());
  locationDecoderURL.searchParams.set('adult', adults.toString());
  locationDecoderURL.searchParams.set('children', children.toString());
  locationDecoderURL.searchParams.set('ages', childAges.flat().join());
  
  return locationDecoderURL;
};

export const parseDate = (date: Date) => {
  return date.toISOString().split('T')[0].split('-').join('/');
};