import { IFormConfiguration, ILocationDecoderConfiguration } from '../../types';

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
