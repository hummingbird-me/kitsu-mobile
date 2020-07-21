import { useQuery } from '@apollo/client';
import getScrollingPosters from './getScrollingPosters.graphql';

type Image = { height?: number; width?: number; url: string };

function extractPosters(nodes: any): Image[] {
  if (!nodes) return [];
  return nodes.map((node: any) => node.posterImage.small[0]);
}

export default function useScrollingPosters() {
  const { loading, error, data } = useQuery(getScrollingPosters);

  return {
    loading,
    error,
    data: {
      trendingAnime: extractPosters(data?.trendingAnime?.nodes),
      trendingManga: extractPosters(data?.trendingManga?.nodes),
    },
  };
}
