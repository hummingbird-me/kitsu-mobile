import React from 'react';
import { View, TouchableOpacity, Image, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import kitsuLogo from 'kitsu/assets/img/kitsu-logo.png';
import * as colors from 'kitsu/constants/colors';
import styles from './styles';

export const OnboardingHeader = ({ navigation, backEnabled, style, componentRight }) => (
  <View style={[styles.absolute, style]}>
    <View style={styles.headerContainer}>
      <View style={{ width: 30 }}>
        {backEnabled ? (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="ios-arrow-back" color={colors.white} size={26} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
      <Image style={styles.logo} source={kitsuLogo} />
      <View style={{ width: 30 }}>{componentRight}</View>
    </View>
  </View>
);

OnboardingHeader.propTypes = {
  style: ViewPropTypes.style,
  backEnabled: PropTypes.bool,
};

OnboardingHeader.defaultProps = {
  style: null,
  backEnabled: false,
};
