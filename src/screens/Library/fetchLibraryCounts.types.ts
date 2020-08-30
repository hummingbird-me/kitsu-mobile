import * as Types from '../../types/graphql';

export type FetchLibraryCountsQueryVariables = Types.Exact<{
  mediaType: Types.Media_Type;
}>;


export type FetchLibraryCountsQuery = (
  { __typename?: 'Query' }
  & { currentAccount?: Types.Maybe<(
    { __typename?: 'Account' }
    & Pick<Types.Account, 'id'>
    & { profile: (
      { __typename?: 'Profile' }
      & { library: (
        { __typename?: 'Library' }
        & { current: (
          { __typename?: 'LibraryEntryConnection' }
          & Pick<Types.LibraryEntryConnection, 'totalCount'>
        ), planned: (
          { __typename?: 'LibraryEntryConnection' }
          & Pick<Types.LibraryEntryConnection, 'totalCount'>
        ), completed: (
          { __typename?: 'LibraryEntryConnection' }
          & Pick<Types.LibraryEntryConnection, 'totalCount'>
        ), onHold: (
          { __typename?: 'LibraryEntryConnection' }
          & Pick<Types.LibraryEntryConnection, 'totalCount'>
        ), dropped: (
          { __typename?: 'LibraryEntryConnection' }
          & Pick<Types.LibraryEntryConnection, 'totalCount'>
        ) }
      ) }
    ) }
  )> }
);
