import React from 'react';
import { View, Image, ViewPropTypes } from 'react-native';
import { slidelogo } from 'kitsu/assets/img/onboarding/';
import styles from './styles';

const OnboardingHeader = ({ style }) => (
  <View style={[styles.logoWrapper, style]}>
    <Image style={styles.logo} source={slidelogo} />
  </View>
);

OnboardingHeader.propTypes = {
  style: ViewPropTypes.style,
};

OnboardingHeader.defaultProps = {
  style: null,
};

export default OnboardingHeader;
