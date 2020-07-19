import React, { useRef } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import logo from 'app/assets/img/intro/slidelogo.png';
import Button, { styles as btnStyles } from 'app/components/button';
import Carousel from './Carousel';
import * as colors from 'app/constants/colors';

// The Intro screen handles
export default function Intro() {
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
        <ScrollView horizontal bounces={false} pagingEnabled ref={scrollView}>
          <View style={{ width: windowWidth }}>
            <View style={{ flex: 4 }}>
              <Carousel />
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
                onPress={() => scrollView.current.scrollToEnd()}
                style={styles.getStartedButton}
                textStyle={btnStyles.accessory.textBold}>
                Get Started
              </Button>
            </View>
          </View>
          <View style={{ width: windowWidth }}>
            <Text>Hello!</Text>
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
