import { IFormConfiguration, ILocationDecoderConfiguration } from "../../types";

export const formConf: IFormConfiguration = {
    searchInputSelector: {
      query: '#destinatie_v2',
      itemCount: 0,
    },
  
    searchButtonSelector: {
      query: '#A2_v2',
      itemCount: 0,
      buttonVisible: true,
    },
};


export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://www.directbooking.ro/ro.aspx'),
  resolveCaptcha: false,
}