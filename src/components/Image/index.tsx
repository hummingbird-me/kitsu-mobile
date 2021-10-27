import React, { useRef } from 'react';
import {
  Animated,
  View,
  ImageStyle,
  ViewStyle,
  ImageResizeMode,
} from 'react-native';

import Blurhash from 'app/components/Blurhash';

type ImageViewType = {
  height: number;
  width: number;
  name?: string;
  url: string;
};
type ImageType = {
  views: ImageViewType[];
  blurhash?: string;
};

const viewsToSource = (
  views: ImageViewType[]
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
}: {
  height: number;
  width: number;
  source: ImageType;
  resizeMode?: ImageResizeMode;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}) {
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const fadeInImage = () => {
    Animated.timing(imageOpacity, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start();
  };

  return (
    <View style={[style]}>
      {source?.blurhash ? (
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
            imageStyle,
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
    </View>
  );
}
