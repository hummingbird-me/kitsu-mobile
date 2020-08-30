import { useQuery, ApolloQueryResult } from '@apollo/client';
import getScrollingPosters from './getScrollingPosters.graphql';
import { GetScrollingPostersQuery } from './getScrollingPosters.types';

type Image = { height?: number; width?: number; url: string };

function extractPosters(nodes: any): Image[] {
  if (!nodes) return [];
  return nodes.map((node: any) => node.posterImage.small[0]);
}

export default function useScrollingPosters(): ApolloQueryResult<{
  trendingAnime: Image[];
  trendingManga: Image[];
}> {
  const result = useQuery<GetScrollingPostersQuery>(getScrollingPosters);

  return {
    ...result,
    data: {
      trendingAnime: extractPosters(result?.data?.trendingAnime?.nodes),
      trendingManga: extractPosters(result?.data?.trendingManga?.nodes),
    },
  };
}
