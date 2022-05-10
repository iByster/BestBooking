import { IFormConfiguration, ILocationDecoderConfiguration } from "../../types";

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
      
    },

    inputButtonSelector: {
      query: '#ss',
      itemCount: 0,
  }
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://www.booking.com/'),
  resolveCaptcha: false,
  needStyle: false,
}