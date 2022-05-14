import { IFormConfiguration, ILocationDecoderConfiguration, IUserInput } from '../../types';

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
    query:
      '#location-field-destination-menu > div.uitk-menu-container.animation-disabled.uitk-menu-open.uitk-menu-pos-left.uitk-menu-container-text-nowrap > div.uitk-typeahead-results > ul > li:nth-child(1)',
    itemCount: 0,
    buttonVisible: true,
  },

  inputButtonSelector: {
    query:
      '#location-field-destination-menu > div.uitk-field.has-floatedLabel-label.has-no-placeholder > div.uitk-field.has-floatedLabel-label.has-icon.has-no-placeholder > button',
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
    return r.childAges.forEach(ca => {
      children.push(`${i+1}_${ca}`);
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

