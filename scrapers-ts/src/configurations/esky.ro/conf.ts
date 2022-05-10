import { IFormConfiguration, ILocationDecoderConfiguration } from "../../types";

export const formConf: IFormConfiguration = {
    searchInputSelector: {
      query: 'body > hot-app > ng-component > div > div > esky-search-form > esky-oneway-roundtrip-form > form > section > fieldset.trip-destinations > div > esky-popular-places > span > esky-new-autocomplete-picker > div.picker-container > esky-new-autocomplete-topbar > div > esky-new-autocomplete-input > div > div > input',
      itemCount: 0,
    },
  
    searchButtonSelector: {
      query: 'button[type=submit]',
      itemCount: 0,
      buttonVisible: true,
    },

    selectInputOption: {
      query: 'body > hot-app > ng-component > div > div > esky-search-form > esky-oneway-roundtrip-form > form > section > fieldset.trip-destinations > div > esky-popular-places > span > esky-new-autocomplete-picker > div.picker-container > div > esky-new-autocomplete-section > esky-new-autocomplete-hints-list > esky-new-autocomplete-hint > div > span',
      itemCount: 0,
      
    },

    acceptCookiesSelector: {
      query: '#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay > div > button.css-47sehv',
      itemCount: 0,
    },

    inputButtonSelector: {
      query: 'body > hot-app > ng-component > div > div > esky-search-form > esky-oneway-roundtrip-form > form > section > fieldset.trip-destinations > div > esky-popular-places > span > esky-new-autocomplete-input > div > div > input',
      itemCount: 0,
  }
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://www.esky.ro/cazare/search?arrivalLat=46.3692&arrivalLon=25.8096&arrivalCode=35961&arrivalType=city&rangeStartDate=2022-06-13&rangeEndDate=2022-06-13&isFlexSearch=false&stayLength=11,11&rooms[0][adults]=2&token=b04f212a-cfe1-43fc-853d-603aed6c947f'),
  resolveCaptcha: false,
}