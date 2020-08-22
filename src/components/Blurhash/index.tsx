import React, { useState } from 'react';
import {
  View,
  Image,
  LayoutRectangle,
  ImageProps,
  ImageSourcePropType,
} from 'react-native';
import { GLSnapshot } from 'expo-gl';

import * as Console from 'app/utils/log';
import usePromise from 'app/hooks/usePromise';
import {
  render as renderBlurhash,
  getAverageColor as getAverageColorFromBlurhash,
} from 'app/utils/blurhash';

export default function Blurhash({
  blurhash,
  height,
  width,
  punch = 1,
  ...props
}: {
  blurhash: string;
  height: number;
  width: number;
  punch?: number;
} & Omit<ImageProps, 'source'>) {
  const [r, g, b] = getAverageColorFromBlurhash(blurhash);
  const backgroundColor = `rgb(${r}, ${g}, ${b})`;

  const { state, value, error } = usePromise<GLSnapshot>(async () => {
    return renderBlurhash({
      blurhash,
      height,
      width,
      punch,
    });
  }, [blurhash, height, width, punch]);

  if (state === 'fulfilled') {
    // We provide our own height and width to allow scaling it
    const source: ImageSourcePropType = {
      uri: value!.uri as string,
      height,
      width,
    };
    console.log(value);
    return <Image height={height} width={width} source={source} {...props} />;
  } else {
    if (error) Console.error(error);

    return (
      <View
        {...props}
        style={[{ backgroundColor }, { width, height }, props.style]}
      />
    );
  }
}
