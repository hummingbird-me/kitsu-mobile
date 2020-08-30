import * as Types from '../../types/graphql';

export type GetScrollingPostersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetScrollingPostersQuery = (
  { __typename?: 'Query' }
  & { trendingAnime: (
    { __typename?: 'MediaConnection' }
    & { nodes?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'Anime' }
      & { posterImage: (
        { __typename?: 'Image' }
        & { small: Array<(
          { __typename?: 'ImageView' }
          & Pick<Types.ImageView, 'height' | 'width' | 'url'>
        )> }
      ) }
    ) | (
      { __typename?: 'Manga' }
      & { posterImage: (
        { __typename?: 'Image' }
        & { small: Array<(
          { __typename?: 'ImageView' }
          & Pick<Types.ImageView, 'height' | 'width' | 'url'>
        )> }
      ) }
    )>>> }
  ), trendingManga: (
    { __typename?: 'MediaConnection' }
    & { nodes?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'Anime' }
      & { posterImage: (
        { __typename?: 'Image' }
        & { small: Array<(
          { __typename?: 'ImageView' }
          & Pick<Types.ImageView, 'height' | 'width' | 'url'>
        )> }
      ) }
    ) | (
      { __typename?: 'Manga' }
      & { posterImage: (
        { __typename?: 'Image' }
        & { small: Array<(
          { __typename?: 'ImageView' }
          & Pick<Types.ImageView, 'height' | 'width' | 'url'>
        )> }
      ) }
    )>>> }
  ) }
);
