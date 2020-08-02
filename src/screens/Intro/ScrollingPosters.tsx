import React, { useRef, useEffect } from 'react';
import {
  View,
  useWindowDimensions,
  Animated,
  Easing,
  Image,
} from 'react-native';
import * as Sentry from 'sentry-expo';
import _ from 'lodash';

import useScrollingPosters from './useScrollingPosters';

export default function ScrollingPosters({
  posterSize = 115,
  posterMargin = 8,
  posterRadius = 8,
  posterCount = 10,
  speed = 40000,
}) {
  const { loading, error, data } = useScrollingPosters();

  const rowHeight = posterSize + posterMargin * 2;
  const { width: screenWidth } = useWindowDimensions();
  const scrollWidth = (posterSize + posterMargin * 2) * posterCount;

  const scrollAnim = useRef(new Animated.Value(0)).current;
  const animation = Animated.loop(
    Animated.timing(scrollAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: speed,
      easing: Easing.linear,
    })
  );
  const leftScroll = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -scrollWidth],
  });
  const rightScroll = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-scrollWidth * 2 + screenWidth, -scrollWidth + screenWidth],
  });

  const images = _.mapValues(data, (posters: any[]) => {
    return [...posters, ...posters].map(({ url }: { url: string }, index) => (
      <Image
        source={{ uri: url }}
        key={index}
        style={{
          width: posterSize,
          height: posterSize,
          margin: posterMargin,
          borderRadius: posterRadius,
        }}
      />
    ));
  });

  useEffect(() => animation.start(), []);

  return (
    <View
      style={{
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
      <Animated.View
        style={{
          flexDirection: 'row',
          height: rowHeight,
          transform: [
            {
              translateX: rightScroll,
            },
          ],
        }}>
        {images.trendingAnime}
      </Animated.View>
      <Animated.View
        style={{
          flexDirection: 'row',
          height: rowHeight,
          transform: [
            {
              translateX: leftScroll,
            },
          ],
        }}>
        {images.trendingManga}
      </Animated.View>
    </View>
  );
}
