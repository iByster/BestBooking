import dotenv from 'dotenv';
import DropPoint from './type-orm.config';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import MyContext from './types/MyContext';
import { ShelterResolver } from './resolvers/ShelterResolver';

const main = async () => {
  dotenv.config();

  const PORT = process.env.PORT || 4000;

  DropPoint.initialize()
    .then(() => {
      console.log('DropPoint located 📮');
    })
    .catch((err) => {
      console.error('Failed to locate DropPoint...', err);
    });

  const app = express();

//   const RedisStore = connectRedis(session);
//   const redis = new Redis();

  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

//   app.use(
//     session({
//       name: process.env.COOKIE_NAME,
//       store: new RedisStore({
//         client: redis,
//         disableTouch: true,
//       }),
//       cookie: {
//         maxAge: 1000 * 60 * 60 * 24,
//         httpOnly: true,
//         sameSite: 'lax',
//         secure: __prod__,
//       },
//       saveUninitialized: false,
//       secret: 'djapsjdasjdaisdbvc[uewuwr-yewhfbfclkvn',
//       resave: false,
//     })
//   );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        ShelterResolver
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
};

main().catch((err) => {
    console.log(err);
});
