import { useQuery, QueryResult } from '@apollo/client';
import { result } from 'lodash';

import loadAccount from './loadAccount.graphql';
import { LoadAccountQuery } from './loadAccount.types';

export default function useAccount() {
  const { data, ...result }: QueryResult<LoadAccountQuery> = useQuery(
    loadAccount
  );
  return {
    ...result,
    data: data?.currentAccount,
  };
}
