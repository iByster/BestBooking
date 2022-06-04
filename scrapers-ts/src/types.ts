import { JSONObject } from 'puppeteer';
import { Hotel } from './entities/Hotel';

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

export type ExtractType = 'text' | 'link' | 'title' | 'list';
export type WorkerType = 'DomJS' | 'Puppeteer' | 'RequestGraphQL' | 'RequestREST';

export interface IScraperSelector extends JSONObject {
  selector: IGeneralSelector;
  type: ExtractType;
  // extract?(res: string): string;
}

export interface IScrapeSelectors  {
  containerSelector?: IScraperSelector;
  itemSelector?: IScraperSelector;
  priceSelector?: IScraperSelector;
  imageSelector?: IScraperSelector;
  startsSelect?: IScraperSelector;
  currencySelector?: IScraperSelector;
  locationNameSelector?: IScraperSelector;
  linkToHotelSelector?: IScraperSelector;
  ratingSelector?: IScraperSelector;
  distanceSelector?: IScraperSelector;
  guestsSelector?: IScraperSelector;
  nightsSelector?: IScraperSelector;
  showMoreSelector?: IScraperSelector; 
  noElementsSelector?: IScraperSelector; 
}

export interface IScraperConfiguration {
  url: string;
  workerType: WorkerType;
  pageItemCount: number;
  infiniteScroll: boolean;
  virtualization: boolean;
  pagination: boolean;
  ssr: boolean;
  decodedURLQueryParams: boolean;
  payload: boolean;
  query: boolean;
  initialPaginationValue: number;
  needStyle?: boolean;
  scrapeSelectors?: IScrapeSelectors;
}

export interface IGraphQLScraperConfiguration extends IScraperConfiguration {

}

export interface IRESTScraperConfiguration extends IScraperConfiguration {
  ssr: boolean;
  decodedURLQueryParams: boolean;
}

export interface IPuppeterScraperConfiguration extends IScraperConfiguration {

}

export interface IJSDomScraperConfiguration extends IScraperConfiguration {

}

export interface IRoom {
  adults: number;
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

export type QueueCallback<N> = (err: any, result?: N) => void;

export interface WorkerPayload {
  decodedURL: string;
  origin: string;
  userInput: IUserInput;
  initialPage?: number;
}

export interface WorkerResponse {
  payload: Hotel[];
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
  image: string;
  distanceFromLocation?: number;
  guests?: number;
  nights?: number;
  bonus?: IBonusHotelInformation;
}
