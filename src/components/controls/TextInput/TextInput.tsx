import React from 'react';
import {
  Keyboard,
  TextInput as RNTextInput,
  View,
  type TextInputProps as RNTextInputProps,
  type ViewStyle,
} from 'react-native';

import * as colors from 'kitsu/constants/colors';

import { styles } from './styles';

export type TextInputProps = {
  containerStyle?: ViewStyle;
} & RNTextInputProps;

export default function TextInput({
  style,
  containerStyle,
  ...otherProps
}: TextInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <RNTextInput
        {...otherProps}
        style={[styles.input, style]}
        placeholderTextColor={colors.grey}
        underlineColorAndroid={colors.transparent}
        onSubmitEditing={Keyboard.dismiss}
        keyboardAppearance={'dark'}
      />
    </View>
  );
}
