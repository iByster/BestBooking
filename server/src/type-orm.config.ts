import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Shelter } from './entities/Shelter';
dotenv.config();

const DropPoint = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  synchronize: true,
  entities: [Shelter],
});

export default DropPoint;
