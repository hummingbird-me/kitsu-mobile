import React from 'react';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  from as linkFrom,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Constants from 'expo-constants';

import { useSession } from './SessionContext';

const ApolloContext: React.FC = function ApolloContext({ children }) {
  const session = useSession();
  const host = Constants.manifest.extra.kitsu.host;

  // TODO: refresh session when access token expires or 401 error
  const authenticate = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: session ? `Bearer ${session.accessToken}` : '',
      },
    };
  });

  const link = linkFrom([
    authenticate,
    new HttpLink({ uri: `${host}/api/graphql` }),
  ]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloContext;
