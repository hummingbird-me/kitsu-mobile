import Icon from '@expo/vector-icons/FontAwesome';
import React, { forwardRef, useState } from 'react';
import { Controller, type ControllerProps } from 'react-hook-form';
import {
  TouchableOpacity,
  View,
  type TextInput as RNTextInput,
} from 'react-native';

import TextInput, {
  type TextInputProps,
} from '@/components/controls/TextInput';

import { styles } from './styles';

export type PasswordInputProps = TextInputProps;

const PasswordInput = forwardRef<RNTextInput, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <View style={styles.container}>
        <TextInput
          containerStyle={styles.input}
          {...props}
          ref={ref}
          secureTextEntry={!isVisible}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.toggle}
          onPress={() => setIsVisible(!isVisible)}>
          <Icon name={isVisible ? 'eye' : 'eye-slash'} style={styles.eyeIcon} />
        </TouchableOpacity>
      </View>
    );
  }
);

export default PasswordInput;

export function ControlledPasswordInput(
  props: PasswordInputProps & Omit<ControllerProps, 'render'>
) {
  return (
    <Controller
      {...props}
      render={({ field }) => (
        <PasswordInput {...field} {...props} onChangeText={field.onChange} />
      )}
    />
  );
}
