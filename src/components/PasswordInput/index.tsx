import React, { useState, forwardRef } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import Input from 'app/components/Input';
import { styles } from './styles';

const PasswordInput: React.RefForwardingComponent<
  TextInput,
  React.ComponentProps<typeof Input>
> = function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Input
        containerStyle={styles.input}
        {...props}
        ref={ref}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCompleteType="password"
      />
      <TouchableOpacity
        hitSlop={{ left: 20 }}
        style={styles.toggle}
        onPress={() => setVisible(!visible)}>
        <Icon name={visible ? 'eye' : 'eye-slash'} style={styles.eyeIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default forwardRef(PasswordInput);
