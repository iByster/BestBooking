import { JSONObject } from "puppeteer";

export interface ILocationDecoderConfiguration {
    url: URL;
    formConfiguration: IFormConfiguration;
    resolveCaptcha: boolean;
    needStyle: boolean;
}

export interface IFormConfiguration {
    searchInputSelector: IGeneralSelector;
    searchButtonSelector: IButtonSelector;
    inputButtonSelector?: IGeneralSelector;
    selectInputOption?: IButtonSelector;
    acceptCookiesSelector? : IGeneralSelector;
}

export interface IButtonSelector extends IGeneralSelector {
    buttonVisible: boolean;
}

export interface IGeneralSelector extends JSONObject {
    query: string;
    itemCount: number;
}

export type QueueCallback<N> = (err: any, result?: N) => void;

export interface QueueItem<T, N> {
 callback: QueueCallback<N>;
 getData: () => T;
}