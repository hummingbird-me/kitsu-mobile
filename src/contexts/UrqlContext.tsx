import { offlineExchange } from '@urql/exchange-graphcache';
import { makeAsyncStorage } from '@urql/storage-rn';
import React from 'react';
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql';

import { kitsuConfig } from 'kitsu/config/env';
import resolvers from 'kitsu/graphql/resolvers';
import schema from 'kitsu/graphql/schema';
import authExchange from 'kitsu/graphql/urql-exchanges/auth';

const UrqlContext: React.FC<{ children: React.ReactNode }> = function ({
  children,
}): JSX.Element {
  const storage = makeAsyncStorage({
    maxAge: 7,
  });
  const client = createClient({
    exchanges: [
      dedupExchange,
      offlineExchange({
        storage,
        schema,
        keys: {
          Image: () => null,
          ImageView: () => null,
          TitlesList: () => null,
        },
        resolvers,
      }),
      authExchange(),
      fetchExchange,
    ],
    url: `${kitsuConfig.kitsuUrl}/api/graphql`,
  });

  return <Provider value={client}>{children}</Provider>;
};
export default UrqlContext;
