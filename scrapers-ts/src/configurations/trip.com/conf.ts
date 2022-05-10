import { IFormConfiguration, ILocationDecoderConfiguration } from "../../types";

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