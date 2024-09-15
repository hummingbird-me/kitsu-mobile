import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import TextInput, {
  type TextInputProps,
} from '@/components/controls/TextInput';

import { styles } from './styles';

export type PasswordInputProps = TextInputProps;

export default function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        containerStyle={styles.input}
        {...props}
        secureTextEntry={!isVisible}
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
