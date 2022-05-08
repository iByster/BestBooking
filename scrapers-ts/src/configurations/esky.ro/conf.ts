import { JSONObject } from "puppeteer";

export interface IFormConfiguration {
    searchInputSelector: IGeneralSelector;
    searchButtonSelector: IGeneralSelector;
}

export interface IGeneralSelector extends JSONObject {
    query: string;
    itemCount: number;
}

export const formConf: IFormConfiguration = {
    searchInputSelector: {
      query: 'body > hot-app > ng-component > div > div > esky-search-form > esky-oneway-roundtrip-form > form > section > fieldset.trip-destinations > div > esky-popular-places > span > esky-new-autocomplete-input > div > div > input  ',
      itemCount: 0,
    },
  
    searchButtonSelector: {
      query: 'button[type=submit]',
      itemCount: 0,
    },
};