import React from 'react';
import { View, TextInput, ViewPropTypes, Keyboard } from 'react-native';
import { PropTypes } from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

export const Input = ({ style, containerStyle, ...otherProps }) => (
  <View style={[styles.container, containerStyle]}>
    <TextInput
      {...otherProps}
      style={[styles.input, style]}
      placeholderTextColor={colors.grey}
      underlineColorAndroid={colors.transparent}
      onSubmitEditing={Keyboard.dismiss}
      keyboardAppearance={'dark'}
    />
  </View>
);

Input.propTypes = {
  ...TextInput.propTypes,
  style: PropTypes.object,
  containerStyle: ViewPropTypes.style,
};
Input.defaultProps = {
  style: null,
  containerStyle: null,
};
