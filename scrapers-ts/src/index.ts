import DropPoint from './type-orm.config';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import dotenv from 'dotenv';
import HotelResolver from './resolvers/HotelResolver';
import { MyContext } from './types';
import { EventEmitter } from "events";
import { WorkerPool } from './worker-pool/WorkerPool';
import path from 'path';

const main = async () => {
  dotenv.config();

  const eventEmitter = new EventEmitter();
  const workerPool = new WorkerPool(path.join(__dirname, 'worker-pool', 'worker.js'), 8)

  const PORT = process.env.PORT || 4000;

  await DropPoint.initialize();

  const app = express();

  app.set('eventEmitter', eventEmitter);
  app.set('workerPool', workerPool);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HotelResolver
      ],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      }),
    ],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
};

main().catch((e) => console.log(e));
