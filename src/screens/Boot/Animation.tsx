import React, { useRef, useState, useEffect } from 'react';
import { Easing, Animated, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import logoAnimation from 'app/assets/animation/kitsu.json';
import Overlay from 'app/components/overlay';
import { darkPurple } from 'app/constants/colors';

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
  const [isLottieFinished, setLottieFinished] = useState(false);
  const [isAnimationFinished, setAnimationFinished] = useState(false);

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
        autoPlay
        loop={false}
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
