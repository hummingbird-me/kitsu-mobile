import * as Types from '../types/graphql';

export type LoadAccountQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LoadAccountQuery = (
  { __typename?: 'Query' }
  & { currentAccount?: Types.Maybe<(
    { __typename?: 'Account' }
    & Pick<Types.Account, 'id' | 'language' | 'ratingSystem' | 'sfwFilter' | 'timeZone' | 'country'>
    & { profile: (
      { __typename?: 'Profile' }
      & Pick<Types.Profile, 'id' | 'url' | 'name'>
      & { avatarImage?: Types.Maybe<(
        { __typename?: 'Image' }
        & Pick<Types.Image, 'blurhash'>
        & { views: Array<(
          { __typename?: 'ImageView' }
          & Pick<Types.ImageView, 'name' | 'url' | 'height' | 'width'>
        )> }
      )>, bannerImage?: Types.Maybe<(
        { __typename?: 'Image' }
        & Pick<Types.Image, 'blurhash'>
        & { views: Array<(
          { __typename?: 'ImageView' }
          & Pick<Types.ImageView, 'name' | 'url' | 'height' | 'width'>
        )> }
      )> }
    ) }
  )> }
);
