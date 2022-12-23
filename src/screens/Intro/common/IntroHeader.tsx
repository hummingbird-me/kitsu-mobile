import React from 'react';
import { View } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import FastImage from 'react-native-fast-image';
import { slidelogo } from 'kitsu/assets/img/intro/';
import styles from './styles';

interface IntroHeaderProps {
  style?: unknown;
}

const IntroHeader = ({
  style
}: IntroHeaderProps) => (
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
