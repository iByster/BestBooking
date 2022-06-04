import { BaseEntity } from './BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class LocationDecoderURL extends BaseEntity {
  @Column()
  siteOrigin!: string;

  @Column()
  locationName!: string;

  @Column({default: -1})
  locationId?: number;

  @Column()
  extractedURL!: string;
}