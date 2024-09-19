import {
  Image as ExpoImage,
  type ImageProps as ExpoImageProps,
} from 'expo-image';
import React from 'react';
import Animated from 'react-native-reanimated';

import { graphql, type FragmentOf } from '@/utils/graphql';

export const ImageFragment = graphql(`
  fragment ImageFragment on Image @_unmask {
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
  source?: FragmentOf<typeof ImageFragment> | null;
} & Omit<ExpoImageProps, 'source'>;

export default Animated.createAnimatedComponent(
  React.forwardRef<ExpoImage, ImageProps>(function Image(
    { source, ...props }: ImageProps,
    ref
  ) {
    return (
      <ExpoImage
        ref={ref}
        source={source ? viewsToSource(source?.views) : null}
        placeholder={source?.blurhash ? { blurhash: source.blurhash } : null}
        transition={500}
        {...props}
      />
    );
  })
);
