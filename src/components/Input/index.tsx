import React, { forwardRef } from 'react';
import { View, TextInput, TextStyle, ViewStyle } from 'react-native';
import * as colors from 'app/constants/colors';
import { styles } from './styles';

const Input: React.RefForwardingComponent<
  TextInput,
  {
    style?: TextStyle;
    containerStyle?: ViewStyle;
  } & React.ComponentProps<typeof TextInput>
> = function Input({ style, containerStyle, ...otherProps }, ref) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...otherProps}
        ref={ref}
        style={[styles.input, style]}
        placeholderTextColor={colors.grey}
        underlineColorAndroid={colors.transparent}
        keyboardAppearance={'dark'}
      />
    </View>
  );
};

export default forwardRef(Input);
