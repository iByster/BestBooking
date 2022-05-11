import { IFormConfiguration, ILocationDecoderConfiguration } from "../../types";

export const formConf: IFormConfiguration = {
    searchInputSelector: {
      query: '#react-destination-typeahead',
      itemCount: 0,
    },
  
    searchButtonSelector: {
      query: '#root > header > div.HeroImage > div.Jumbotron > div > div > div.StickyContainer.StickyContainer > div > div:nth-child(3) > form > div > div.search-form__field.search-form__button-field.search-form__details-field.search-form__details-button-field.search-form__submit-details-button-field > button',
      itemCount: 0,
      buttonVisible: true,
    },

    selectInputOption: {
      query: '#Typeahead__results > div > div:nth-child(1)',
      itemCount: 0,
      buttonVisible: true,
    },

    inputButtonSelector: {
      query: '#root > header > div.HeroImage > div.Jumbotron > div > div > div.StickyContainer.StickyContainer > div > div:nth-child(3) > form > div > div.search-form__field-wrapper.search-form__field-wrapper--destination > div > div > div.search-destination-input > div.search-destination-input__header.state--closed',
      itemCount: 0,
      focusOn: false,
  }
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
    formConfiguration: formConf,
    url: new URL('https://www.vrbo.com/'),
    resolveCaptcha: false,
    needStyle: false,
}