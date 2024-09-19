import React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import { useQuery } from 'urql';

import Image, { ImageFragment } from '@/components/content/Image';
import { graphql } from '@/utils/graphql';

const ScrollingPostersQuery = graphql(
  `
    query ScrollingPostersQuery($count: Int!) {
      trendingAnime: globalTrending(mediaType: ANIME, first: $count) {
        nodes {
          id
          posterImage {
            ...ImageFragment
          }
        }
      }
      trendingManga: globalTrending(mediaType: MANGA, first: $count) {
        nodes {
          id
          posterImage {
            ...ImageFragment
          }
        }
      }
    }
  `,
  [ImageFragment]
);

const POSTER_WIDTH = 115;
const POSTER_HEIGHT = 115;
const POSTER_GAP = 16;
const POSTER_COUNT = 10;
const SCROLL_SPEED = 0.03; // Distance per millisecond
const SCROLL_DISTANCE = POSTER_WIDTH * POSTER_COUNT + POSTER_GAP * POSTER_COUNT;

function useScrollingPosters() {
  const [result] = useQuery({
    query: ScrollingPostersQuery,
    variables: { count: POSTER_COUNT },
  });

  return {
    trendingAnime:
      result?.data?.trendingAnime?.nodes?.map((node) => node?.posterImage) ??
      [],
    trendingManga:
      result?.data?.trendingManga?.nodes?.map((node) => node?.posterImage) ??
      [],
  };
}

// This animation for this component is a bit complicated to provide a seamless scrolling effect
// with panning gestures. The posters in a row are duplicated, and they only ever scroll from 0.25
// to 0.75 before looping back to 0.25. This creates the illusion of a continuous scrolling effect,
// while allowing the user to scroll in either direction to see more posters.
export default function ScrollingPosters({ style }: { style?: ViewStyle }) {
  const isPanning = useSharedValue(false);
  const { width: windowWidth } = useWindowDimensions();
  const posters = useScrollingPosters();

  /* Scrolling Animation */
  const animation = useSharedValue(SCROLL_DISTANCE / 2);
  useFrameCallback(({ timeSincePreviousFrame }) => {
    if (isPanning.value) return;
    const distance = (timeSincePreviousFrame ?? 0) * SCROLL_SPEED;
    // Try to keep our number small to avoid floating point precision issues
    animation.value = (animation.value + distance) % SCROLL_DISTANCE;
  });

  /* Scrolling Gestures */
  const pan = useSharedValue(0);
  const pans = [
    Gesture.Pan()
      .onStart(() => (isPanning.value = true))
      .onChange(
        (event) => (pan.value = (pan.value - event.changeX) % SCROLL_DISTANCE)
      )
      .onFinalize((event) => {
        isPanning.value = false;
        pan.value = withDecay({
          velocity: -event.velocityX,
        });
      }),
    Gesture.Pan()
      .onStart(() => (isPanning.value = true))
      .onChange(
        (event) => (pan.value = (pan.value + event.changeX) % SCROLL_DISTANCE)
      )
      .onFinalize((event) => {
        isPanning.value = false;
        pan.value = withDecay({
          velocity: event.velocityX,
        });
      }),
  ];

  /* Derive the translations for the two rows */
  const total = useDerivedValue(
    () =>
      // This nonsense is to get the modulo instead of remainder
      ((((animation.value + pan.value) % SCROLL_DISTANCE) + SCROLL_DISTANCE) %
        SCROLL_DISTANCE) +
      windowWidth / 2
  );
  const translations = [
    useDerivedValue(() => -(SCROLL_DISTANCE * 0.5 + total.value)),
    useDerivedValue(() => -(SCROLL_DISTANCE * 1.5 - total.value)),
  ];

  return (
    <View style={[styles.container, style]}>
      {[posters.trendingManga, posters.trendingAnime].map((images, index) => (
        <GestureDetector key={index} gesture={pans[index]}>
          <View style={styles.rowContainer}>
            <Animated.View
              style={[
                styles.row,
                { transform: [{ translateX: translations[index] }] },
              ]}>
              {/* We duplicate the images to create a seamless scrolling effect */}
              {[...images, ...images].map((image, index) => (
                <Image key={index} source={image} style={styles.image} />
              ))}
            </Animated.View>
          </View>
        </GestureDetector>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    overflow: 'hidden',
  },
  rowContainer: {
    height: POSTER_HEIGHT + POSTER_GAP,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    margin: POSTER_GAP / 2,
    borderRadius: 8,
  },
});
