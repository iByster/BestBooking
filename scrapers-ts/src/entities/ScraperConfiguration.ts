import { Column, Entity } from 'typeorm';
import { IScraperConfiguration, IScrapeSelectors, WorkerType } from '../types';
import { BaseEntity } from './BaseEntity';

@Entity()
export class ScraperConfiguration extends BaseEntity implements IScraperConfiguration {
  @Column()
  siteOrigin!: string;

  @Column({ type: 'text' })
  workerType!: WorkerType;

  @Column()
  pageItemCount!: number;

  @Column()
  infiniteScroll!: boolean;

  @Column()
  virtualization!: boolean;

  @Column()
  pagination!: boolean;

  @Column()
  ssr!: boolean;

  @Column()
  decodedURLQueryParams!: boolean;

  @Column()
  payload!: boolean;

  @Column()
  query!: boolean;

  @Column()
  initialPaginationValue!: number;

  @Column({ nullable: true })
  offset!: number;

  @Column()
  needStyle!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  scrapeSelectors?: IScrapeSelectors;
}