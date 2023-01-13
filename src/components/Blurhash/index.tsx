import { GLSnapshot } from 'expo-gl';
import React from 'react';
import { Image, ImageProps, ImageSourcePropType, View } from 'react-native';

import usePromise from 'kitsu/hooks/usePromise';
import * as Console from 'kitsu/utils/log';

import { getAverageColor } from './decoder';
import renderBlurhash from './renderer';

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
  const [r, g, b] = getAverageColor(blurhash);
  const backgroundColor = `rgb(${r}, ${g}, ${b})`;

  // Check that we're running natively before doing GL stuff
  // @ts-ignore - global.nativeCallSyncHook is from RN environment
  if (global.nativeCallSyncHook) {
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
      return <Image height={height} width={width} source={source} {...props} />;
    } else {
      if (error) Console.warn('Blurhash failed', error);

      return (
        <View
          {...props}
          style={[{ backgroundColor }, { width, height }, props.style]}
        />
      );
    }
  } else {
    return (
      <View
        {...props}
        style={[{ backgroundColor }, { width, height }, props.style]}
      />
    );
  }
}
