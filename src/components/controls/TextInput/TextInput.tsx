import React, { forwardRef } from 'react';
import { Controller, type ControllerProps } from 'react-hook-form';
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

const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput(
  { style, containerStyle, ...otherProps },
  ref
) {
  return (
    <View style={[styles.container, containerStyle]}>
      <RNTextInput
        {...otherProps}
        ref={ref}
        style={[styles.input, style]}
        placeholderTextColor={colors.grey}
        underlineColorAndroid={colors.transparent}
        onSubmitEditing={Keyboard.dismiss}
        keyboardAppearance={'dark'}
      />
    </View>
  );
});
export default TextInput;

export function ControlledTextInput(
  props: TextInputProps & Omit<ControllerProps, 'render'>
) {
  return (
    <Controller
      {...props}
      render={({ field }) => (
        <TextInput {...field} {...props} onChangeText={field.onChange} />
      )}
    />
  );
}
