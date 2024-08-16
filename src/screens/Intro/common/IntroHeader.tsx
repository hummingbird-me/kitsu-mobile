import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

import { slidelogo } from 'kitsu/assets/img/intro/';

import styles from './styles';

type IntroHeaderProps = {
  style?: unknown;
};

const IntroHeader = ({ style }: IntroHeaderProps) => (
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
