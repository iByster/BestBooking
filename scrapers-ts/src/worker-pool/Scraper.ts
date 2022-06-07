import { WorkerPool } from './WorkerPool';
import { IUserInput, WorkerPayload, WorkerResponse } from '../types';
import ScraperConfigurationService from '../services/ScraperConfigurationService';
import RequestConfigurationService from '../services/RequestConfigurationService';
import { RequestConfiguration } from '../entities/RequestConfiguration';
import HotelService from '../services/HotelService';
import EventEmitter from 'events';
import { PAGE_THRESHOLD } from '../consts';

class Scraper {
  private urls: URL[];
  private userInput: IUserInput;
  private pool: WorkerPool<WorkerPayload, WorkerResponse>;
  private scraperConfigurationService: ScraperConfigurationService;
  private requestConfigurationService: RequestConfigurationService;
  private hotelService: HotelService;
  private eventEmitter: EventEmitter;

  constructor(
    userInput: IUserInput,
    urls: URL[],
    eventEmitter: EventEmitter,
    workerPool: WorkerPool<WorkerPayload, WorkerResponse>
  ) {
    this.urls = urls;
    this.userInput = userInput;
    this.pool = workerPool;
    this.scraperConfigurationService = new ScraperConfigurationService();
    this.requestConfigurationService = new RequestConfigurationService();
    this.hotelService = new HotelService();
    this.eventEmitter = eventEmitter;
  }

  public async scrape() {
    const locations: WorkerResponse[] = [];
    let blockFinished = 0;

    await Promise.all(
      this.urls.map(async (url) => {
        let pageContor = 1;

        let res: WorkerResponse;

        const scraperConf =
          await this.scraperConfigurationService.getScraperConfigurationByOrigin(
            url.origin
          );

        if (scraperConf) {
          let requestConfiguration: RequestConfiguration | null;

          if (
            scraperConf.workerType === 'RequestGraphQL' ||
            scraperConf.workerType === 'RequestREST'
          ) {
            requestConfiguration =
              await this.requestConfigurationService.getRequestConfigurationByDomain(
                url.origin
              );
          }

          res = await this.pool.run(() => ({
            decodedURL: url.href,
            origin: url.origin,
            userInput: this.userInput,
            scraperConf,
            requestConfiguration,
          }));

          await this.hotelService.saveHotels(res.payload);
          blockFinished += 1;

          if (blockFinished === this.urls.length) {
            console.log('event fired');
            this.eventEmitter.emit('first cluster done');
          }

          if (res.isMore) {
            do {
              console.log('CLUSTER: ', pageContor);
              res = await this.pool.run(() => ({
                decodedURL: url.href,
                origin: url.origin,
                userInput: this.userInput,
                scraperConf,
                requestConfiguration,
                page: pageContor * PAGE_THRESHOLD * scraperConf.pageItemCount,
              }));

              await this.hotelService.saveHotels(res.payload);
              pageContor += 1;
            } while (res.isMore);
          }

          // locations.push(res);
          // console.log(`finished ${url}`, res);
        } else {
          console.log('No configuration found');
        }
      })
    );
  }
}

export default Scraper;
