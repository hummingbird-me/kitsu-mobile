import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import logo from 'app/assets/img/intro/slidelogo.png';
import Button, { styles as btnStyles } from 'app/components/Button';
import Carousel from './Carousel';
import Registration from './Registration';
import * as colors from 'app/constants/colors';
import { IntroNavigatorParamList } from 'app/navigation/Intro';

// The Intro screen handles
export default function IntroScreen({
  navigation,
}: {
  navigation: StackNavigationProp<IntroNavigatorParamList, 'Intro'>;
}) {
  const insets = useSafeArea();
  const { width: windowWidth } = useWindowDimensions();
  const scrollView = useRef(null);

  return (
    <View
      style={{
        paddingTop: insets.top,
        ...styles.container,
      }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={logo} />
      </View>
      <View style={{ flex: 4 }}>
        <ScrollView
          horizontal
          bounces={false}
          pagingEnabled
          scrollEnabled={Platform.OS === 'ios'}
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          ref={scrollView}>
          <View style={{ width: windowWidth }}>
            <View style={{ flex: 4 }}>
              <Carousel
                onProgress={(progress) => {
                  if (progress > 3) {
                    scrollView.current?.scrollToEnd();
                  }
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: '100%',
                ...styles.horizMargin,
              }}>
              <Button
                kind="white"
                onPress={() => scrollView.current?.scrollToEnd()}
                style={styles.getStartedButton}
                textStyle={btnStyles.accessory.textBold}>
                Get Started
              </Button>
            </View>
          </View>
          <View style={{ width: windowWidth }}>
            <Registration navigation={navigation} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  horizMargin: {
    paddingLeft: 18,
    paddingRight: 18,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.darkPurple,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 22,
  },
  getStartedButton: {
    height: 47,
    backgroundColor: colors.white,
    width: '100%',
  },
});
