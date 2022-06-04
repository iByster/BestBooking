import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Hotel } from './entities/Hotel';
import { RequestConfiguration } from './entities/RequestConfiguration';
import { LocationDecoderURL } from './entities/LocationDecoderURL';
dotenv.config();

const DropPoint = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // logging: true,
  synchronize: true,
  entities: [Hotel, RequestConfiguration, LocationDecoderURL],
});

export default DropPoint;
