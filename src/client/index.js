import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { createBrowserHistory } from 'history';
import App from './App';

const history = createBrowserHistory();

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8080/graphql',
  }),
  cache: new InMemoryCache(),
  credentials: 'include',
  onError: ({ graphQLErrors, networkError, response }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        return message
      });
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
      return networkError
    }
  },
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  }
});


const Root = () => {
  return (
    <Router>
      <ApolloProvider client={client}>
        <App history={history} />
      </ApolloProvider>
    </Router>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<Root />, rootElement);
