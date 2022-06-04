import { WorkerPool } from './WorkerPool';
import path from 'path';
import { IUserInput, WorkerPayload, WorkerResponse } from '../types';

class Scraper {
  private urls: URL[];
  private userInput: IUserInput;
  private pool: WorkerPool<WorkerPayload, WorkerResponse>;

  constructor(userInput: IUserInput, urls: URL[]) {
    this.urls = urls;
    this.userInput = userInput;
    this.pool = new WorkerPool(path.join(__dirname, 'worker.js'), 4);
  }

  public async scrape() {
    const locations: WorkerResponse[] = [];

    await Promise.all(
      this.urls.map(async (url) => {
        const res = await this.pool.run(() => ({ decodedURL: url.href, origin: url.origin, userInput: this.userInput }));
        locations.push(res);
        console.log(`finished ${url}`, res);
      })
    );
  }
}

export default Scraper;
