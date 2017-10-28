import React from 'react';
import { View, Image, ViewPropTypes } from 'react-native';
import { slidelogo } from 'kitsu/assets/img/onboarding/';
import styles from './styles';

const IntroHeader = ({ style }) => (
  <View style={[styles.logoWrapper, style]}>
    <Image style={styles.logo} source={slidelogo} />
  </View>
);

IntroHeader.propTypes = {
  style: ViewPropTypes.style,
};

IntroHeader.defaultProps = {
  style: null,
};

export default IntroHeader;
