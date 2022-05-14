import { WorkerPool } from './WorkerPool';
import path from 'path';
import { WorkerPayload, WorkerResponse } from '../types';

class Scraper {
  private urls: URL[];
  private pool: WorkerPool<WorkerPayload, WorkerResponse>;
  constructor(urls: URL[]) {
    this.urls = urls;
    this.pool = new WorkerPool(path.join(__dirname, 'worker.js'), 4);
  }

  public async scrape() {
    const locations: WorkerResponse[] = [];

    Promise.all(
      this.urls.map(async (url) => {
        const res = await this.pool.run(() => ({ url: url.href }));
        locations.push(res);
        console.log(`finished ${url}`, res);
      })
    ).then(() => {
      console.log('finished all');
    });
  }
}

export default Scraper;
