import { BaseEntity } from './BaseEntity';
import { Column, Entity } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Hotel extends BaseEntity {
  @Field()
  @Column()
  siteOrigin!: string;

  @Field()
  @Column()
  hotelName!: string;

  @Field()
  @Column()
  locationName!: string;

  @Field()
  @Column({ type: 'float', nullable: true })
  priceTotal?: number;

  @Field()
  @Column({ type: 'float', nullable: true })
  priceTotalInRON?: number;

  @Field()
  @Column({ type: 'float', nullable: true })
  priceNight?: number;
 
  @Field()
  @Column({ type: 'float', nullable: true })
  priceRoom?: number;

  @Field()
  @Column()
  currency!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  rating?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  distanceFromLocation?: string;

  @Field()
  @Column()
  adults!: number;

  @Field()
  @Column()
  rooms!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nights?: number;

  @Field(() => [Int])
  @Column({ type: 'int', array: true })
  childAges!: number[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  children!: number;
  
  @Field({ nullable: true })
  @Column({ nullable: true })
  reviews?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  link!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageLink?: string;

  @Field()
  @Column()
  checkIn!: Date;

  @Field()
  @Column()
  checkOut!: Date;

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  lat?: number;

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  lon?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  country!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  area?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  adress?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  region?: string;
}
