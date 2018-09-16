import React from 'react';
import { View, Text, TouchableOpacity, ViewPropTypes } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import kitsuLogo from 'kitsu/assets/img/kitsu-logo.png';
import * as colors from 'kitsu/constants/colors';
import styles from './styles';
import { Navigation } from 'react-native-navigation';
import { isEmpty } from 'lodash';

export const OnboardingHeader = ({
  componentId,
  backEnabled,
  style,
  buttonRightEnabled,
  buttonRightText,
  buttonRightOnPress,
}) => (
  <View style={[styles.absolute, style]}>
    <View style={styles.headerContainer}>
      <View style={{ width: 70 }}>
        {backEnabled ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => !isEmpty(componentId) && Navigation.pop(componentId)}
          >
            <Icon name="ios-arrow-back" color={colors.white} size={26} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
      <FastImage style={styles.logo} source={kitsuLogo} />
      <TouchableOpacity
        onPress={buttonRightOnPress}
        disabled={!buttonRightEnabled}
        style={styles.buttonRight}
      >
        <Text style={[styles.buttonRightText, buttonRightEnabled && styles.buttonRightEnabled]}>
          {buttonRightText}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

OnboardingHeader.propTypes = {
  style: ViewPropTypes.style,
  backEnabled: PropTypes.bool,
  componentId: PropTypes.any,
};

OnboardingHeader.defaultProps = {
  style: null,
  backEnabled: false,
  componentId: null,
};
