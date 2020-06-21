import React, { useRef, useState } from 'react';
import { Easing, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import logoAnimation from 'app/assets/animation/kitsu.json';
import Overlay from 'app/components/overlay';
import { darkPurple } from 'app/constants/colors';

export default function BootAnimation({ onAnimationFinish }: any) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
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
        autoSize
        loop={false}
        onAnimationFinish={() => {
          setAnimationFinished(true);
          fadeOut().then(onAnimationFinish);
        }}
        style={{ width: '100%' }}
      />
    </Overlay>
  );
}
