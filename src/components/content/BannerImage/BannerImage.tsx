import { type Image as ExpoImage } from 'expo-image';
import React from 'react';
import Animated from 'react-native-reanimated';

import DEFAULT_BANNER from '@/assets/img/default_cover.png';
import Image, { type ImageProps } from '@/components/content/Image';

export { ImageFragment as BannerImageFragment } from '@/components/content/Image';

export type BannerImageProps = ImageProps;

export default Animated.createAnimatedComponent(
  React.forwardRef<ExpoImage, BannerImageProps>(function BannerImage(
    { style, source, ...props },
    ref
  ) {
    source = source ?? {
      views: [{ url: DEFAULT_BANNER, height: 400, width: 1440 }],
      blurhash: 'c16b#q_M00nD4WQwyaTCio%w%NRQS#nSVu',
    };
    return (
      <Image
        ref={ref}
        source={source}
        style={[{ width: '100%' }, style]}
        {...props}
      />
    );
  })
);
