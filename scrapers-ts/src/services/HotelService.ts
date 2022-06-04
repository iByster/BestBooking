import { Hotel } from '../entities/Hotel';
import { IUserInput } from '../types';
import {
  destructureRooms,
  getUniqueListBy,
} from '../utils/parseUtils';
import moment from 'moment';

class HotelService {
  public async searchExistsToday(userInput: IUserInput) {
    const { checkIn, checkOut, locationName, rooms } = userInput;

    const { adults, children } = destructureRooms(rooms);

    const res = await Hotel.createQueryBuilder()
      .where({
        adults,
        children,
        checkIn,
        checkOut,
        locationName,
        rooms: rooms.length,
      })
      .andWhere('CURRENT_DATE = DATE("createdAt")')
      .getOne();

    console.log(res);
    if (res) {
      return true;
    }

    return false;
  }

  public async getHotelsByNameSortedByPrice(hotelName: string) {
    const res = await Hotel.find({
      where: { hotelName },
      order: { priceTotalInRON: 'DESC' },
    });

    return res;
  }

  public async getHotelsByUserInput(userInput: IUserInput, filters: any) {
    const { checkIn, checkOut, locationName, rooms } = userInput;

    const { adults, children } = destructureRooms(rooms);

    const dateFormat = 'YYYY-MM-DD';

    const checkInFormatted = moment.parseZone(checkIn).format(dateFormat);
    const checkOutFormatted = moment.parseZone(checkOut).format(dateFormat);

    const groups = await Hotel.createQueryBuilder().connection.query(
      `SELECT "hotelName", COUNT("hotelName") FROM public.hotel
         WHERE adults = $1 AND children = $2 
         AND DATE("checkIn") = $3 
         AND DATE("checkOut") = $4
         AND "locationName" = $5 AND rooms = $6
         GROUP BY "hotelName"`,
      [
        adults,
        children,
        checkInFormatted,
        checkOutFormatted,
        locationName,
        rooms.length,
      ]
    );

    const payload = groups.map(async (g: any) => {
      const { hotelName } = g;

      const hotels = await this.getHotelsByNameSortedByPrice(hotelName);
      const uniqueHotels = getUniqueListBy(hotels, 'siteOrigin');
      return uniqueHotels;
    });

    return payload;
  }
}

export default HotelService;
