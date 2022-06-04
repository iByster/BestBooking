import { IRoom, IUserInput } from '../types';
import axios from 'axios';

export const extractFloatFromString = (text: string) => {
  const regex = /[+-]?\d+(\.\d+)?/g;

  const matches = text.match(regex);

  if (matches) {
    return parseFloat(matches[0]);
  }

  return;
};

export const calculateTotalPriceByRoomPrice = (
  userInput: IUserInput,
  priceRoom: number
) => {
  const { checkIn, checkOut, rooms } = userInput;

  const nights = Math.ceil(
    Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
  );

  return rooms.length * priceRoom * nights;
};

export const calculateTotalPriceByNightPrice = (
  userInput: IUserInput,
  priceNight: number
) => {
  const { checkIn, checkOut } = userInput;

  const nights = Math.ceil(
    Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
  );

  return priceNight * nights;
};

export const extractCurrency = (currencyText: string) => {
  if (
    currencyText.includes('$') ||
    currencyText.toLocaleLowerCase().includes('usd')
  ) {
    return 'USD';
  }

  if (
    currencyText.includes('€') ||
    currencyText.toLocaleLowerCase().includes('eur')
  ) {
    return 'EUR';
  }

  if (
    currencyText.toLocaleLowerCase().includes('lei') ||
    currencyText.toLocaleLowerCase().includes('ron')
  ) {
    return 'RON';
  }

  if (
    currencyText.toLocaleLowerCase().includes('£') ||
    currencyText.toLocaleLowerCase().includes('gbp')
  ) {
    return 'GBP';
  }

  return 'EUR';
};

export const parseDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const calculateTotalPriceInRON = async (
  totalPrice: number,
  currency: any
) => {
  const url = `https://api.exchangerate.host/${parseDate(
    new Date()
  )}?base=${currency}&symbols=RON`;

  const response = await axios({ url });

  return parseFloat((response.data.rates.RON * totalPrice).toFixed(2));
};

export const getNights = (checkIn: Date, checkOut: Date) => {
  const nights = Math.ceil(
    Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
  );

  return nights;
};

export const destructureRooms = (rooms: IRoom[]) => {
  const adults = rooms.reduce((a, b) => a + b.adults, 0);
  const children = rooms.reduce((a, b) => a + b.childAges.length, 0);
  const childAges = rooms.map((r) => {
    return r.childAges;
  }).flat();

  return { adults, childAges, children };
};

export const getUniqueListBy = (arr: any[], key: any) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}
