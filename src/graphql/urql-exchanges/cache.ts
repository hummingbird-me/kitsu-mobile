import { offlineExchange } from '@urql/exchange-graphcache';
import { makeAsyncStorage } from '@urql/storage-rn';

import resolvers from '@/graphql/resolvers';
import schema from '@/graphql/schema';

const storage = makeAsyncStorage({
  maxAge: 7,
});

export default offlineExchange({
  storage,
  schema,
  keys: {
    Image: () => null,
    ImageView: () => null,
    TitlesList: () => null,
  },
  resolvers,
});
