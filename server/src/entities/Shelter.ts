import { Field, Int, ObjectType } from 'type-graphql';
import { Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@ObjectType()
@Entity()
export abstract class Shelter extends BaseEntity {
  @Field(() => Int)
  price?: number;

  @Field(() => String)
  locationName?: string;

  @Field(() => String)
  shelterName?: string;
}
