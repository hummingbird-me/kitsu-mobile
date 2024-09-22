import { type ResultOf } from '@graphql-typed-document-node/core';
import React, { createContext, useContext } from 'react';
import { useQuery } from 'urql';

import { ImageFragment } from '@/components/content/Image';
import InvariantViolated from '@/errors/InvariantViolated';
import { graphql } from '@/utils/graphql';

const AccountQuery = graphql(
  `
    query AccountQuery {
      currentAccount {
        id
        profile {
          id
          name
          bannerImage {
            ...ImageFragment
          }
          avatarImage {
            ...ImageFragment
          }
        }
      }
    }
  `,
  [ImageFragment]
);

const AccountContext = createContext<
  ResultOf<typeof AccountQuery>['currentAccount'] | null
>(null);

export default function AccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ data, error }] = useQuery({
    query: AccountQuery,
    requestPolicy: 'cache-and-network',
  });

  if (error)
    throw new InvariantViolated('Failed to fetch current account', {
      cause: error,
    });
  if (!data) throw new InvariantViolated('Current account data missing');

  return (
    <AccountContext.Provider value={data.currentAccount}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const account = useContext(AccountContext);
  if (!account) throw new InvariantViolated('Account context missing');
  return account;
}
