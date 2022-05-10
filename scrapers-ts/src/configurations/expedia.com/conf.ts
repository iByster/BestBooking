import { IFormConfiguration, ILocationDecoderConfiguration } from "../../types";

export const formConf: IFormConfiguration = {
    searchInputSelector: {
      query: '#location-field-destination',
      itemCount: 0,
    },
  
    searchButtonSelector: {
      query: '#wizard-hotel-pwa-v2-1 > div.uitk-layout-grid.uitk-layout-grid-gap-three.uitk-layout-grid-columns-small-1.uitk-layout-grid-columns-medium-8.uitk-layout-grid-columns-large-12.uitk-spacing.uitk-spacing-padding-small-blockstart-three.uitk-spacing-padding-small-blockend-six.uitk-spacing-padding-medium-blockstart-three > div.uitk-layout-grid-item.uitk-layout-grid-item-columnspan.uitk-layout-grid-item-columnspan-small-1.uitk-layout-grid-item-columnspan-medium-2.uitk-layout-grid-item-columnspan-large-2 > button',
      itemCount: 0,
      buttonVisible: true,
    },

    selectInputOption: {
      query: '#location-field-destination-menu > div.uitk-menu-container.animation-disabled.uitk-menu-open.uitk-menu-pos-left.uitk-menu-container-text-nowrap > div.uitk-typeahead-results > ul > li:nth-child(2)',
      itemCount: 0,
      
    },

    inputButtonSelector: {
      query: '#hotels-destination-menu > div.uitk-menu-trigger > div.uitk-field.has-floatedLabel-label.has-icon.has-placeholder > button',
      itemCount: 0,
  }
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
    formConfiguration: formConf,
    url: new URL('https://www.expedia.com/'),
    resolveCaptcha: false,
}