import React from 'react';
import { View, TextInput } from 'react-native';
import { styles } from './styles';

export const PostTextInput = props => (
  <View style={styles.postTextInputBox}>
    <TextInput
      ref={props.inputRef}
      style={styles.postTextInputField}
      {...props}
    />
  </View>
);
