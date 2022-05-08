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
    //   query: 'input[name="ss"]',
      query: '#ss',
      itemCount: 0,
    },
  
    searchButtonSelector: {
      query: 'button[type=submit]',
      itemCount: 0,
    },
};