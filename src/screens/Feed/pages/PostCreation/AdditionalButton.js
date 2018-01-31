import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, ViewPropTypes } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    borderColor: colors.green,
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: colors.green,
    fontSize: 14,
    marginRight: 4,
  },
  text: {
    color: colors.green,
    fontSize: 14,
  },
});

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
