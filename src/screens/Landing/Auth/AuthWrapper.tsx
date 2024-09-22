import { Image } from 'expo-image';
import React from 'react';
import { Platform, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { slidelogo } from 'kitsu/assets/img/intro/';

import AnimatedWrapper from './AnimatedWrapper';
import styles from './styles';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => (
  <KeyboardAwareScrollView
    contentContainerStyle={styles.stretch}
    scrollEnabled={Platform.select({ ios: false, android: true })}>
    <View style={styles.stretch}>
      <AnimatedWrapper />
      <Image style={styles.logo} contentFit={'contain'} source={slidelogo} />
    </View>
    {children}
  </KeyboardAwareScrollView>
);

export default AuthWrapper;
