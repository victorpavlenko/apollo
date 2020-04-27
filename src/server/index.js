import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';

import resolvers from './graphql/resolvers';
import { isEmail } from './graphql/directives';

// import { formatError } from '~/errors'
import { readFileSync } from 'fs';

import { makeExecutableSchema } from 'graphql-tools';
const typeDefs = readFileSync('./graphql/schema.graphql', 'utf-8');

const { MONGO_DB_URI, PORT } = process.env;

const app = express();

mongoose.set('useCreateIndex', true);

app.use(express.static('dist'));

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isEmail: isEmail
  }
});

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res }),
  // formatError,
  playground: {
    settings: {
      'request.credentials': 'include',
      'schema.polling.enable': false
    }
  }
});

server.applyMiddleware({
  app,
  cors: {
    credentials: true,
    origin: 'http://localhost:3000'
  }
});

mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  const port = PORT || 8080;
  app.listen({ port }, () => {
    console.log(`Server running on port ${port}`);
  });
});
mongoose.connection.on('error', error => console.error(error));
