import React from 'react';
import { Platform, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { slidelogo } from 'kitsu/assets/img/intro/';

import AnimatedWrapper from './AnimatedWrapper';
import styles from './styles';

const AuthWrapper = ({ children }) => (
  <KeyboardAwareScrollView
    enableOnAndroid={false}
    extraHeight={80}
    contentContainerStyle={styles.stretch}
    scrollEnabled={Platform.select({ ios: false, android: true })}
  >
    <View style={styles.stretch}>
      <AnimatedWrapper />
      <FastImage
        style={styles.logo}
        resizeMode={'contain'}
        source={slidelogo}
      />
    </View>
    {children}
  </KeyboardAwareScrollView>
);

export default AuthWrapper;
