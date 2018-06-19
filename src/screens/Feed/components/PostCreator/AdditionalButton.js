import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { additionalButtonStyles as styles } from './styles';

export const AdditionalButton = ({ onPress, disabled, text, icon, color, style }) => (
  <TouchableOpacity
    style={[styles.container, { borderColor: color }, style]}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.innerContainer} >
      <Icon name={icon} style={[styles.icon, { color }]} />
      <Text style={[styles.text, { color }]}>
        {text}
      </Text>
    </View>
  </TouchableOpacity>
);

AdditionalButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

AdditionalButton.defaultProps = {
  disabled: false,
  style: null,
};
