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

export interface WorkerResponse extends IHotelInfomartion {
}

interface IRoom {
  adults: number,
  childAges: number[];
}

type ExtractType = 'text' | 'link' | 'title';
export type WorkerType = 'DomJS' | 'Puppeteer';

export interface IScraperSelector {
  selector: IGeneralSelector;
  type: ExtractType;
  extract?(res: string): string; 
}

export interface IScraperConfiguration {
  url: string;
  workerType: WorkerType;
  pageItemCount: number;
  containerSelector(containerNumber: number): IGeneralSelector;
  itemSelector(itemNumber: number): IGeneralSelector;
  priceSelector: IScraperSelector;
  startsSelect: IScraperSelector;
  currencySelector: IScraperSelector;
  locationNameSelector: IScraperSelector;
  linkToHotelSelector: IScraperSelector;
  ratingSelector: IScraperSelector;
  distanceSelector: IScraperSelector;
  guestsSelector: IScraperSelector;
  nightsSelector: IScraperSelector;
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

interface IBonusHotelInformation {
  breakfastIncluded: boolean;
}
export interface IHotelInfomartion {
  linkToHotel: URL;
  hotelName: string;
  locationName: string;
  price: number;
  currency: string;
  rating: number;
  starts: number;
  distanceFromLocation?: number;
  guests?: number;
  nights?: number;
  bonus?: IBonusHotelInformation;
}
