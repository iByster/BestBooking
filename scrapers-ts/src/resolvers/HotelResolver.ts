import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { Hotel } from '../entities/Hotel';
import LocationDecoder from '../location-decoder/LocationDecoder';
import HotelService from '../services/HotelService';
import LocationDecoderURLService from '../services/LocationDecoderURLService';
import {
  ILocationDecoderConfiguration,
  IRoom,
  IUserInput,
  MyContext,
} from '../types';
import { locationDecoderConf as bookingComLocationDecoderConf } from '../configurations/booking.com/conf';
import { locationDecoderConf as hotelsComLocationDecoderConf } from '../configurations/hotels.com/conf';
import { locationDecoderConf as tripComLocationDecoderConf } from '../configurations/trip.com/conf';
import { locationDecoderConf as agodaComLocationDecoderConf } from '../configurations/agoda.com/conf';
import Scraper from '../worker-pool/Scraper';
import { waitFor } from 'wait-for-event';

@InputType()
export class HotelMetadata {
  @Field(() => Int)
  limit!: number;

  @Field({ nullable: true })
  offset!: number;
}

@InputType()
class Room implements IRoom {
  @Field()
  adults!: number;

  @Field(() => [Int])
  childAges!: number[];
}

@InputType()
class UserInput implements IUserInput {
  @Field()
  checkIn!: Date;

  @Field()
  checkOut!: Date;

  @Field()
  locationName!: string;

  @Field(() => [Room])
  rooms!: Room[];
}

@ObjectType()
class PaginatedHotels {
  @Field(() => [[Hotel]])
  hotels!: Hotel[][];
  @Field()
  hasMore?: boolean;
}

@Resolver()
class HotelResolver {
  private hotelService = new HotelService();
  private locationDecoderURLService = new LocationDecoderURLService();
  private configurations = [
    bookingComLocationDecoderConf,
    hotelsComLocationDecoderConf,
    agodaComLocationDecoderConf,
    tripComLocationDecoderConf,
  ];

  @Query(() => PaginatedHotels)
  public async getGeniusHotelsOffers(
    @Ctx() { req }: MyContext,
    @Arg('userInput') userInput: UserInput,
    @Arg('metadata') metadata: HotelMetadata
  ): Promise<PaginatedHotels> {
    const eventEmitter = req.app.get('eventEmitter');

    const searchedToday = await this.hotelService.searchExistsToday(userInput);
    let hotels;

    if (searchedToday) {
      hotels = await this.hotelService.getHotelsByUserInput(userInput, {}, metadata);
    } else {
      const decodedURLs: URL[] = [];
      const neededConf: ILocationDecoderConfiguration[] = [];

      for (let i = 0; i < this.configurations.length; ++i) {
        const res =
          await this.locationDecoderURLService.checkIfLocationIdStored(
            // TODO should check if created_at is up-to-date
            userInput.locationName,
            this.configurations[i].url.origin
          );

        if (res) {
          decodedURLs.push(new URL(res.extractedURL));
        } else {
          neededConf.push(this.configurations[i]);
        }
      }

      if (neededConf.length > 0) {
        const locationDecoder = new LocationDecoder(
          neededConf,
          userInput.locationName
        );
        const extractedURLs = await locationDecoder.getAllUrls();
        decodedURLs.push(...extractedURLs);
      }

      if (decodedURLs.length > 0) {
        const workerPool = req.app.get('workerPool');

        const scraper = new Scraper(
          userInput,
          decodedURLs,
          eventEmitter,
          workerPool
        );

        scraper.scrape();

        await waitFor('first cluster done', eventEmitter);

        hotels = await this.hotelService.getHotelsByUserInput(userInput, {}, metadata);
      } else {
        console.log('error');
      }
    }

    return { hotels, hasMore: true };
  }
}

export default HotelResolver;
