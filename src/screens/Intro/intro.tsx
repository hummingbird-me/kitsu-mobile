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
    <View
      style={{
        paddingTop: insets.top,
        ...styles.container,
      }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={logo} />
      </View>
      <View style={{ flex: 3 }}>
        <IntroCarousel />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%',
        }}>
        <Button
          onPress={() => alert('Hello, world!')}
          title="Get Started"
          style={styles.getStartedButton}
          titleStyle={{ color: colors.darkPurple }}
          bold={true}
        />
      </View>
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
    justifyContent: 'space-between',
    paddingBottom: 22,
    paddingLeft: 18,
    paddingRight: 18,
  },
  getStartedButton: {
    height: 47,
    backgroundColor: colors.white,
    width: '100%',
  },
});
