import React from 'react';
import { Keyboard, TextInput, View, ViewStyle } from 'react-native';

import * as colors from 'kitsu/constants/colors';

import { styles } from './styles';

type InputProps = {
  style?: ViewStyle;
  containerStyle?: ViewStyle;
};

export const Input = ({ style, containerStyle, ...otherProps }: InputProps) => (
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
