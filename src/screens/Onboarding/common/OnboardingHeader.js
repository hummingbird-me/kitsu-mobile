import React from 'react';
import { View, Text, Image } from 'react-native';
import logo from 'kitsu/assets/img/kitsu-logo.png';
import styles from './styles';

const OnboardingHeader = () => (
  <View style={styles.logoWrapper}>
    <Image style={styles.logo} source={logo} />
    <Text style={styles.logoText}>KITSU</Text>
  </View>
);

OnboardingHeader.propTypes = {};

OnboardingHeader.defaultProps = {};

export default OnboardingHeader;
