import LottieView from 'lottie-react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useWindowDimensions, type ViewStyle } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';

import logoAnimation from '@/assets/animation/splash/full.json';
import { kitsuPurple } from '@/constants/palette';
import { mark } from '@/utils/performance';
import storage from '@/utils/storage';

/*
  Two things are happening in parallel: the app is booting, and the animation is
  running. When the animation is done, it pauses to wait until isBooted=true,
  then runs the final fadeOut animation and calls onAnimationFinish
 */

const HAS_SEEN_ANIMATION = 'screens/BootAnimation:seen';

const HIDE_ANIMATION = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  100: {
    transform: [{ scale: 4 }],
    opacity: 0,
    easing: Easing.cubic,
  },
});

/*
  Two things are happening in parallel: the app is booting, and the animation is
  running. When the animation is done, it pauses to wait until isBooted=true,
  then runs the final fadeOut animation and calls onAnimationFinish
 */

export default function BootAnimation({
  isBooted = false,
}: {
  isBooted?: boolean;
}) {
  const { width, height } = useWindowDimensions();
  const animation = useRef<LottieView | null>(null);
  const [isLottieFinished, setLottieFinished] = useState(false);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();
  }, []);

  // Start the animation on mount
  useEffect(() => {
    mark('Kitsu.BootAnimation.Start');
    const hasSeenAnimation = storage.getBoolean(HAS_SEEN_ANIMATION) ?? false;
    if (hasSeenAnimation) {
      animation?.current?.play(69, 105);
    } else {
      storage.set(HAS_SEEN_ANIMATION, true);
      animation?.current?.play(0, 135);
    }
  }, []);

  if (isBooted && isLottieFinished) mark('Kitsu.BootAnimation.Hide');

  return isBooted && isLottieFinished ? null : (
    <Animated.View exiting={HIDE_ANIMATION.duration(250)}>
      <LottieView
        source={logoAnimation}
        ref={(ref) => (animation.current = ref)}
        loop={false}
        autoPlay={false}
        onAnimationFinish={() => {
          mark('Kitsu.BootAnimation.Finish');
          setLottieFinished(true);
        }}
        style={{ width, height, backgroundColor: kitsuPurple[5] }}
      />
    </Animated.View>
  );
}
