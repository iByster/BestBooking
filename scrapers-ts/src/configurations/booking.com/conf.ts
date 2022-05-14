import { IFormConfiguration, ILocationDecoderConfiguration, ISearchQueryParameters, ISearchQueryParametersAux, IUserInput } from "../../types";

export const formConf: IFormConfiguration = {
    searchInputSelector: {
    //   query: 'input[name="ss"]',
      query: '#ss',
      itemCount: 0,
    },
  
    searchButtonSelector: {
      query: 'button[type=submit]',
      itemCount: 0,
      buttonVisible: true,
    },

    selectInputOption: {
      query: '#frm > div.xp__fieldset.js--sb-fieldset.accommodation > div.xp__input-group.xp__search > div:nth-child(11) > div.c-autocomplete.sb-destination.-with-clear.region_second_line > ul.c-autocomplete__list.sb-autocomplete__list.sb-autocomplete__list-with_photos > li:first-child',
      itemCount: 0,
      buttonVisible: true,
    },

    inputButtonSelector: {
      query: '#ss',
      itemCount: 0,
      focusOn: false,
  }
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://www.booking.com/'),
  resolveCaptcha: false,
  needStyle: false,
}

export const searchQueryParamsMap: ISearchQueryParameters = {
  // varsta copii
  checkIn: 'checkin',
  checkOut: 'checkout',
  adults: 'group_adults',
  children: 'group_children',
  rooms: 'no_rooms',
};

export const buildURL = (userInput: IUserInput, locationDecoderURL: URL) => {
  const { checkIn, checkOut, rooms } = userInput;
  const adults = rooms.reduce((a, b) => a + b.adults, 0);
  const children = rooms.reduce((a, b) => a + b.childAges.length, 0);
  const childAges = rooms.map(r => {
    return r.childAges;
  }).flat();
  locationDecoderURL.searchParams.set('checkin', parseDate(checkIn));
  locationDecoderURL.searchParams.set('checkout', parseDate(checkOut));
  locationDecoderURL.searchParams.set('no_rooms', rooms.length.toString());
  locationDecoderURL.searchParams.set('group_adults', adults.toString());
  locationDecoderURL.searchParams.set('group_children', children.toString());
  locationDecoderURL.searchParams.delete('age');
  for (let i = 0; i < childAges.length; ++i) {
    locationDecoderURL.searchParams.append(
      'age',
      childAges[i].toString()
    );
  }
  
  return locationDecoderURL;
};

export const searchQueryParametersAux: ISearchQueryParametersAux = {
  priceCurrency: 'EUR',
};

export const parseDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};
