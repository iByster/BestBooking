import { IFormConfiguration, ILocationDecoderConfiguration } from '../../types';

export const formConf: IFormConfiguration = {
  searchInputSelector: {
    query: '#destinatie_v2',
    itemCount: 0,
  },

  searchButtonSelector: {
    query: '#ButtonContinuaCautarea',
    itemCount: 0,
    buttonVisible: true,
  },

  selectInputOption: {
    query: 'body > div.ac_results > ul > li',
    itemCount: 0,
    buttonVisible: true,
  },

  inputButtonSelector: {
    query: '#destinatie_v2',
    itemCount: 0,
    focusOn: true,
  },

  extraStep: {
    query: '#A2_v2',
    itemCount: 0,
  }
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://www.directbooking.ro/ro.aspx'),
  resolveCaptcha: false,
  needStyle: false,
};
