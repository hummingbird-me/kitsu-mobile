import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image';
import React from 'react';

import { FragmentOf, graphql } from '@/utils/graphql';

export const ImageFragment = graphql(`
  fragment ImageFields on Image @_unmask {
    blurhash
    views {
      height
      width
      url
    }
  }
`);

const viewsToSource = (
  views: readonly {
    height?: number | null;
    width?: number | null;
    url: string;
  }[]
): Array<{
  height?: number;
  width?: number;
  uri: string;
}> =>
  views?.map(({ height, width, url }) => ({
    height: height || undefined,
    width: width || undefined,
    uri: url,
  }));

export type ImageProps = {
  source?: FragmentOf<typeof ImageFragment>;
} & Exclude<ExpoImageProps, 'source'>;

export default function Image({ source, ...props }: ImageProps) {
  return source ? (
    <ExpoImage
      source={viewsToSource(source?.views)}
      placeholder={source.blurhash ? { blurhash: source.blurhash } : null}
      transition={500}
      {...props}
    />
  ) : null;
}
