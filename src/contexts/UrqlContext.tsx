import React, { useContext } from 'react';
import { Provider, createClient, fetchExchange } from 'urql';

import { kitsuConfig } from '@/config/env';
import InvariantViolated from '@/errors/InvariantViolated';
import authExchange from '@/graphql/urql-exchanges/auth';
import cacheExchange from '@/graphql/urql-exchanges/cache';

import { SessionContext } from './SessionContext';

export default function UrqlContext({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const sessionContext = useContext(SessionContext);
  if (!sessionContext) throw new InvariantViolated('SessionContext is missing');

  const client = createClient({
    suspense: true,
    exchanges: [cacheExchange, authExchange(sessionContext), fetchExchange],
    url: `${kitsuConfig.kitsuUrl}/api/graphql`,
  });

  return <Provider value={client}>{children}</Provider>;
}
