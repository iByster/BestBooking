import { JSONObject } from 'puppeteer';

export interface ILocationDecoderConfiguration {
  url: URL;
  formConfiguration: IFormConfiguration;
  resolveCaptcha: boolean;
  needStyle: boolean;
}

export interface IFormConfiguration {
  searchInputSelector: IGeneralSelector;
  searchButtonSelector: IButtonSelector;
  inputButtonSelector?: IInputSelector;
  selectInputOption?: IButtonSelector;
  extraStep?: IGeneralSelector;
  acceptCookiesSelector?: IGeneralSelector;
}

export interface IButtonSelector extends IGeneralSelector {
  buttonVisible: boolean;
}

export interface IInputSelector extends IGeneralSelector {
  focusOn: boolean;
}

export interface IGeneralSelector extends JSONObject {
  query: string;
  itemCount: number;
}

export type QueueCallback<N> = (err: any, result?: N) => void;

export interface WorkerPayload {
  url: string;
}

export interface WorkerResponse {
  title: string;
}

interface IRoom {
  adults: number,
  childAges: number[];
}

export interface IUserInput {
  locationName: string;
  checkIn: Date;
  checkOut: Date;
  rooms: IRoom[];
}

export interface ISearchQueryParameters {
//   locationName: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  rooms: string;
}

export interface ISearchQueryParametersAux {
  priceCurrency: string;
  lat?: string;
  lon?: string;
}

export interface QueueItem<T, N> {
  callback: QueueCallback<N>;
  getData: () => T;
}
