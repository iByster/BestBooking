import { BaseEntity } from './BaseEntity';
import { Column, Entity } from 'typeorm';

type ApiType = 'GraphQL' | 'REST';

@Entity()
export class RequestConfiguration extends BaseEntity {
  @Column()
  siteOrigin!: string;

  @Column()
  requestURL!: string;

  @Column({ type: 'text' })
  apiType!: ApiType;

  @Column({ type: 'jsonb' })
  headers!: any;

  @Column({ type: 'json' })
  payload: any;

  @Column({ type: 'jsonb' })
  queryParams: any;

  @Column()
  method!: string;
}