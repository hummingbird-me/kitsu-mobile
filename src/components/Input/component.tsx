import React from 'react';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { View, TextInput, Keyboard } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

interface InputProps {
  style?: object;
  containerStyle?: unknown;
}

export const Input = ({
  style,
  containerStyle,
  ...otherProps
}: InputProps) => (
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
  containerStyle: ViewPropTypes.style
};
Input.defaultProps = {
  style: null,
  containerStyle: null,
};
