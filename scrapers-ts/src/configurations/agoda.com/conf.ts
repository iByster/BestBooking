import { IFormConfiguration, ILocationDecoderConfiguration } from "../../types";

const formConf: IFormConfiguration = {
  searchInputSelector: {
    query: '#SearchBoxContainer > div.Box-sc-kv6pi1-0.bpOVsR.TabContent.OpaqueBackground > div > div.Box-sc-kv6pi1-0.hRUYUu > div > div > div.IconBox.IconBox--autocomplete > div > div > input',
    itemCount: 0,
  },

  searchButtonSelector: {
    query: '#SearchBoxContainer > div.Box-sc-kv6pi1-0.hRUYUu.TabContent__Search--button > button',
    itemCount: 0,
    buttonVisible: false,
  },

  selectInputOption: {
    query: '#SearchBoxContainer > div.Box-sc-kv6pi1-0.bpOVsR.TabContent.OpaqueBackground > div > div.Box-sc-kv6pi1-0.hRUYUu > div > div > div.Popup__container.Popup__container--garage-door > div > div > ul > li:nth-child(1)',
    itemCount: 0,
    buttonVisible: true,
  },

  acceptCookiesSelector: {
    query: 'body > div.ab-iam-root.v3.ab-animate-in.ab-animate-out.ab-effect-modal.ab-show > div.ab-in-app-message.ab-background.ab-modal-interactions.ab-modal.ab-centered > div.ab-message-buttons > button:nth-child(2)',
    itemCount: 0,
  },

  inputButtonSelector: {
    query: '#SearchBoxContainer > div.Box-sc-kv6pi1-0.bpOVsR.TabContent.OpaqueBackground > div > div.Box-sc-kv6pi1-0.hRUYUu > div > div > div.IconBox.IconBox--autocomplete > div > div > input',
    itemCount: 0,
}
};

export const locationDecoderConf: ILocationDecoderConfiguration = {
  formConfiguration: formConf,
  url: new URL('https://www.agoda.com/'),
  resolveCaptcha: false,
  needStyle: true,
}