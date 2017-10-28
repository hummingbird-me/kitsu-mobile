import React from 'react';
import { View, Image, ViewPropTypes } from 'react-native';
import kitsuLogo from 'kitsu/assets/img/kitsu-logo.png';
import styles from './styles';

export const OnboardingHeader = ({ style }) => (
  <View style={[styles.absolute, style]}>
    <View style={styles.headerContainer}>
      <Image style={styles.logo} source={kitsuLogo} />
    </View>
  </View>
);

OnboardingHeader.propTypes = {
  style: ViewPropTypes.style,
};

OnboardingHeader.defaultProps = {
  style: null,
};
