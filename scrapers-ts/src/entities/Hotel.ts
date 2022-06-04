import { BaseEntity } from './BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Hotel extends BaseEntity {
  @Column()
  siteOrigin!: string;

  @Column()
  hotelName!: string;

  @Column()
  locationName!: string;

  @Column({ type: 'float', nullable: true })
  priceTotal?: number;

  @Column({ type: 'float', nullable: true })
  priceTotalInRON?: number;

  @Column({ type: 'float', nullable: true })
  priceNight?: number;
 
  @Column({ type: 'float', nullable: true })
  priceRoom?: number;

  @Column()
  currency!: string;

  @Column({ nullable: true })
  rating?: string;

  @Column({ nullable: true })
  distanceFromLocation?: string;

  @Column()
  adults!: number;

  @Column()
  rooms!: number;

  @Column({ nullable: true })
  nights?: number;

  @Column({ type: 'int', array: true })
  childAges!: number[];

  @Column({ nullable: true })
  children!: number;
  
  @Column({ nullable: true })
  reviews?: string;

  @Column({ nullable: true })
  link!: string;

  @Column({ nullable: true })
  imageLink?: string;

  @Column()
  checkIn!: Date;

  @Column()
  checkOut!: Date;

  @Column({ type: 'float', nullable: true })
  lat?: number;

  @Column({ type: 'float', nullable: true })
  lon?: number;

  @Column({ nullable: true })
  country!: string;

  @Column({ nullable: true })
  area?: string;

  @Column({ nullable: true })
  adress?: string;

  @Column({ nullable: true })
  region?: string;
}
