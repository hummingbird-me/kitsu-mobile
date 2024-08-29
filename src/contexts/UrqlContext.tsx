import { offlineExchange } from '@urql/exchange-graphcache';
import { makeAsyncStorage } from '@urql/storage-rn';
import React, { useContext } from 'react';
import { Provider, createClient, fetchExchange } from 'urql';

import { kitsuConfig } from '@/config/env';
import resolvers from '@/graphql/resolvers';
import schema from '@/graphql/schema';
import authExchange from '@/graphql/urql-exchanges/auth';

import { SessionContext } from './SessionContext';

export default function UrqlContext({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const sessionContext = useContext(SessionContext);
  const storage = makeAsyncStorage({
    maxAge: 7,
  });
  const client = createClient({
    exchanges: [
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
      authExchange(sessionContext),
      fetchExchange,
    ],
    url: `${kitsuConfig.kitsuUrl}/api/graphql`,
  });

  return <Provider value={client}>{children}</Provider>;
}
