import { useQuery, ApolloQueryResult } from '@apollo/client';
import _ from 'lodash';

import fetchLibraryCountsQuery from './fetchLibraryCounts.graphql';
import {
  FetchLibraryCountsQuery,
  FetchLibraryCountsQueryVariables,
} from './fetchLibraryCounts.types';
import { LibraryEntryStatus } from 'app/types/graphql';

export default function fetchLibraryCounts({
  mediaType,
}: FetchLibraryCountsQueryVariables): ApolloQueryResult<
  {
    [key in LibraryEntryStatus]: number;
  }
> {
  const query = useQuery<FetchLibraryCountsQuery>(fetchLibraryCountsQuery, {
    variables: { mediaType },
  });

  if (!query.loading && query.data) {
    const library = query.data.currentAccount?.profile.library;

    return {
      ...query,
      data: {
        CURRENT: library?.current.totalCount || 0,
        PLANNED: library?.planned.totalCount || 0,
        COMPLETED: library?.completed.totalCount || 0,
        ON_HOLD: library?.onHold.totalCount || 0,
        DROPPED: library?.dropped.totalCount || 0,
      },
    };
  } else {
    return {
      ...query,
      data: {
        CURRENT: 0,
        PLANNED: 0,
        COMPLETED: 0,
        ON_HOLD: 0,
        DROPPED: 0,
      },
    };
  }
}
