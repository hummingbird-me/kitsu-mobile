import { ApolloClient, InMemoryCache } from '@apollo/client';
import Constants from 'expo-constants';

export default new ApolloClient({
  uri: `${Constants.manifest.extra.apiHost}api/graphql`,
  cache: new InMemoryCache(),
});
