import React, { useRef, useState, useEffect } from 'react';
import { Easing, Animated, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-community/async-storage';

import logoAnimation from 'app/assets/animation/splash/full.json';
import Overlay from 'app/components/overlay';
import { darkPurple } from 'app/constants/colors';
import usePromise from 'app/hooks/usePromise';

/*
  Two things are happening in parallel: the app is booting, and the animation is
  running. When the animation is done, it pauses to wait until isBooted=true,
  then runs the final fadeOut animation and calls onAnimationFinish
 */

export default function BootAnimation({
  onAnimationFinish,
  isBooted = false,
}: {
  onAnimationFinish: any;
  isBooted: Boolean;
}) {
  const { width, height } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const animation = useRef<LottieView | null>();
  const [isLottieFinished, setLottieFinished] = useState(false);
  const [isAnimationFinished, setAnimationFinished] = useState(false);
  const { state, value: hasSeenAnimation } = usePromise(
    () => AsyncStorage.getItem('screens/BootAnimation:seen'),
    []
  );

  const fadeOut = () => {
    return new Promise((resolve) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.cubic,
        }),
        Animated.timing(scale, {
          toValue: 5,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.cubic,
        }),
      ]).start(resolve)
    );
  };
  // The state has changed
  const tryFadeOut = () => {
    if (isBooted && isLottieFinished) {
      fadeOut()
        .then(() => setAnimationFinished(true))
        .then(onAnimationFinish);
    }
  };
  useEffect(tryFadeOut, [isBooted, isLottieFinished]);
  useEffect(() => {
    if (state !== 'fulfilled') return;

    if (hasSeenAnimation) {
      animation?.current?.play(69, 105);
    } else {
      AsyncStorage.setItem('screens/BootAnimation:seen', 'true');
      animation?.current?.play();
    }
  }, [state]);

  return (
    <Overlay
      style={{
        backgroundColor: darkPurple,
        opacity,
        transform: [{ scale }],
      }}>
      <StatusBar style="light" animated hidden={!isAnimationFinished} />
      <LottieView
        source={logoAnimation}
        ref={(ref) => (animation.current = ref)}
        loop={false}
        autoPlay={false}
        onAnimationFinish={() => setLottieFinished(true)}
        style={{
          width,
          height,
          position: 'absolute',
        }}
      />
    </Overlay>
  );
}
