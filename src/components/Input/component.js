import React from 'react';
import { View, TextInput, ViewPropTypes, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PropTypes } from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

export const Input = ({ style, ...otherProps }) => (
  <View style={styles.wrapper}>
    <TextInput
      {...otherProps}
      style={[styles.input, style]}
      placeholderTextColor={colors.grey}
      underlineColorAndroid={colors.transparent}
      onSubmitEditing={Keyboard.dismiss}
    />
  </View>
);

Input.propTypes = {
  ...TextInput.propTypes,
  style: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
};
Input.defaultProps = {
  style: null,
  wrapperStyle: null,
};
