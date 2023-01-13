import React, { useRef } from 'react';
import { Animated, ImageResizeMode, ImageStyle, ViewStyle } from 'react-native';

import Blurhash from 'kitsu/components/Blurhash';
import {
  Image as GQImage,
  ImageView as GQImageView,
} from 'kitsu/graphql/types';

type ImageViewType = Pick<GQImageView, 'height' | 'width' | 'url'>;
type ImageType = Pick<GQImage, 'blurhash'> & {
  views: ImageViewType[];
};

const viewsToSource = (
  views: readonly ImageViewType[]
): Array<{
  height: number;
  width: number;
  uri: string;
}> =>
  views?.map(({ height, width, url }) => ({
    height,
    width,
    uri: url,
  }));

export default function Image({
  height,
  width,
  source,
  resizeMode,
  style,
  imageStyle,
  blurhashStyle,
}: {
  height: number;
  width: number;
  source?: ImageType | null;
  resizeMode?: ImageResizeMode;
  style?: Animated.WithAnimatedValue<ViewStyle>;
  imageStyle?: Animated.WithAnimatedValue<ImageStyle>;
  blurhashStyle?: ImageStyle;
}) {
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const fadeInImage = () => {
    Animated.timing(imageOpacity, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start();
  };

  return source ? (
    <Animated.View style={style}>
      {source.blurhash ? (
        <Blurhash
          blurhash={source.blurhash}
          height={height}
          width={width}
          resizeMode={resizeMode}
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: '100%',
              width: '100%',
            },
            blurhashStyle,
          ]}
        />
      ) : (
        <></>
      )}
      <Animated.Image
        onLoad={() => fadeInImage()}
        source={viewsToSource(source?.views)}
        resizeMode={resizeMode}
        style={[
          {
            opacity: imageOpacity,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '100%',
            width: '100%',
          },
          imageStyle,
        ]}
      />
    </Animated.View>
  ) : null;
}
