import React from 'react';
import { View, Image, Platform } from 'react-native';
import { slidelogo } from 'kitsu/assets/img/onboarding/';
import AnimatedWrapper from 'kitsu/components/AnimatedWrapper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
      <Image
        style={styles.logo}
        resizeMode={'contain'}
        source={slidelogo}
      />
    </View>
    {children}
  </KeyboardAwareScrollView>
);

export default AuthWrapper;
