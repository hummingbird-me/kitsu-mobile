import React from 'react';
import { View, Text, Image, ViewPropTypes } from 'react-native';
import logo from 'kitsu/assets/img/kitsu-logo.png';
import styles from './styles';

const OnboardingHeader = ({ style }) => (
  <View style={[styles.logoWrapper, style]}>
    <Image style={styles.logo} source={logo} />
    <Text style={styles.logoText}>KITSU</Text>
  </View>
);

OnboardingHeader.propTypes = {
  style: ViewPropTypes.style,
};

OnboardingHeader.defaultProps = {
  style: null,
};

export default OnboardingHeader;
