import { Image } from 'expo-image';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  type ScrollView,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  type DerivedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import logo from '@/assets/img/intro/slidelogo.png';
import { SolidButton } from '@/components/controls/Button';
import { OpenSans } from '@/constants/fonts';
import { kitsuPurple, white } from '@/constants/palette';

import Carousel from './Carousel';

function useDotLevel(progress: SharedValue<number>, index: number) {
  return useDerivedValue(() => {
    const negativeIndex = Math.floor(progress.value);
    const positiveIndex = Math.ceil(progress.value);

    if (index === progress.value) {
      return 1;
    } else if (index === negativeIndex) {
      return positiveIndex - progress.value;
    } else if (index === positiveIndex) {
      return progress.value - negativeIndex;
    } else {
      return 0;
    }
  });
}

function useDotStyles(level: DerivedValue<number>) {
  return [
    styles.overlayDot,
    useAnimatedStyle(() => {
      const scale = interpolate(level.value, [0, 1], [0.65, 1]);
      const opacity = interpolate(level.value, [0, 1], [0.2, 1]);

      return {
        transform: [{ scale }],
        opacity,
      };
    }),
  ];
}

export default function IntroScreen() {
  const intl = useIntl();
  const { width: windowWidth } = useWindowDimensions();
  const progress = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(({ contentOffset }) => {
    progress.value = contentOffset.x / windowWidth;
  });
  const scrollView = useRef<ScrollView>(null);
  // Progress dot animations
  const dotStyles = [
    useDotStyles(useDotLevel(progress, 0)),
    useDotStyles(useDotLevel(progress, 1)),
    useDotStyles(useDotLevel(progress, 2)),
    useDotStyles(useDotLevel(progress, 3)),
    useDotStyles(useDotLevel(progress, 4)),
  ];
  // Animate the bottom overlay elements away like they caught on Page 4
  const overlayOffsetX = useDerivedValue(() =>
    interpolate(progress.value, [3, 4], [0, -windowWidth], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    })
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.overlayLogoContainer}>
          <Image
            source={logo}
            style={styles.overlayLogo}
            contentFit="contain"
          />
        </View>
        <View style={styles.overlaySpacer} />
        <Animated.View
          style={[
            styles.overlayDotContainer,
            { transform: [{ translateX: overlayOffsetX }] },
          ]}>
          <Animated.View style={dotStyles[0]} />
          <Animated.View style={dotStyles[1]} />
          <Animated.View style={dotStyles[2]} />
          <Animated.View style={dotStyles[3]} />
          <Animated.View style={dotStyles[4]} />
        </Animated.View>
        <Animated.View
          style={[
            styles.overlayButtonContainer,
            { transform: [{ translateX: overlayOffsetX }] },
          ]}>
          <SolidButton
            color="grey"
            onPress={() => scrollView.current?.scrollToEnd()}
            style={styles.overlayButton}
            text={intl.formatMessage({
              defaultMessage: 'Get Started',
              description:
                'Intro -> Carousel -> Button to skip to registration page',
            })}
            textStyle={styles.overlayButtonText}
          />
        </Animated.View>
      </SafeAreaView>
      <Carousel
        style={styles.carousel}
        ref={scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={5}
      />
    </View>
  );
}

const horizMargin = {
  paddingHorizontal: 18,
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: 10,
    pointerEvents: 'box-none',
    ...StyleSheet.absoluteFillObject,
  },
  overlayLogoContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLogo: { width: '50%', height: '100%' },
  overlaySpacer: {
    flex: 4,
    pointerEvents: 'none',
  },
  overlayDotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    pointerEvents: 'none',
    gap: 6,
  },
  overlayDot: {
    backgroundColor: white,
    height: 11,
    width: 11,
    transformOrigin: [5.5, 5.5, 0],
    borderRadius: 10,
  },
  overlayButtonContainer: {
    pointerEvents: 'box-none',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    ...horizMargin,
  },
  overlayButton: {
    width: '100%',
    pointerEvents: 'auto',
  },
  overlayButtonText: {
    color: kitsuPurple[7],
    fontFamily: OpenSans.semibold,
    fontSize: 17,
  },
  container: {
    flex: 1,
  },
  carousel: {
    flex: 1,
  },
});
