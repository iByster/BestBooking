import { IFormConfiguration, ILocationDecoderConfiguration } from "../../types";

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
  }
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
    formConfiguration: formConf,
    url: new URL('https://all.accor.com/usa/index.en.shtml'),
    resolveCaptcha: false,
    needStyle: true,
}