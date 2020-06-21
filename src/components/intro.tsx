import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import logo from 'app/assets/img/intro/slidelogo.png';
import Button from 'app/components/button';
import IntroCarousel from 'app/components/intro-carousel';
import * as colors from '../constants/colors';

export default function Intro() {
  const insets = useSafeArea();

  return (
    <View style={{ paddingTop: insets.top, ...styles.container }}>
      <Image source={logo} style={{ width: 483 / 3, height: 135 / 3 }} />
      <IntroCarousel />
      <Button
        onPress={() => alert('Hello, world!')}
        title="Click Me"
        bold={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.darkPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButton: {
    marginBottom: 12,
    backgroundColor: colors.white,
  },
});
