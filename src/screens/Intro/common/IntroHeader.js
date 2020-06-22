import React from 'react';
import { View, ViewPropTypes } from 'react-native';
import FastImage from 'react-native-fast-image';
import { slidelogo } from 'app/assets/img/intro/';
import styles from './styles';

const IntroHeader = ({ style }) => (
  <View style={[styles.logoWrapper, style]}>
    <FastImage style={styles.logo} source={slidelogo} cache="web" />
  </View>
);

IntroHeader.propTypes = {
  style: ViewPropTypes.style,
};

IntroHeader.defaultProps = {
  style: null,
};

export default IntroHeader;
