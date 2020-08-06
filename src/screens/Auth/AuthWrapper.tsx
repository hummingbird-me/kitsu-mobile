import React, { FunctionComponent } from 'react';
import { View, Platform, Image } from 'react-native';
import logo from 'app/assets/img/intro/slidelogo.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AnimatedWrapper from './AnimatedWrapper';
import styles from './styles';

const AuthWrapper: FunctionComponent<{}> = function ({ children }) {
  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={false}
      extraHeight={80}
      contentContainerStyle={styles.stretch}
      scrollEnabled={Platform.select({ ios: false, android: true })}>
      <View style={styles.stretch}>
        <AnimatedWrapper />
        <Image style={styles.logo} resizeMode={'contain'} source={logo} />
      </View>
      <View style={{ marginBottom: bottom }}>{children}</View>
    </KeyboardAwareScrollView>
  );
};

export default AuthWrapper;
