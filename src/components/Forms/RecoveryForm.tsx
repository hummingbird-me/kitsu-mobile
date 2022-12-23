import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'kitsu/components/Button/';
import { Input } from 'kitsu/components/Input';
import CustomIcon from 'kitsu/components/Icon';
import * as colors from 'kitsu/constants/colors';
import styles from './styles';

interface RecoveryFormProps {
  handleChange(...args: unknown[]): unknown;
  data: object;
  onReset(...args: unknown[]): unknown;
  loading: boolean;
  onCancel(...args: unknown[]): unknown;
}

const RecoveryForm = ({
  handleChange,
  data,
  onReset,
  loading,
  onCancel
}: RecoveryFormProps) => (
  <View>
    <Input
      placeholder="E-mail"
      value={data.email}
      onChangeText={text => handleChange(text, 'email')}
      autoCapitalize="none"
    />
    <Button
      loading={loading}
      title={'Send password reset'}
      onPress={onReset}
      style={{ marginTop: 10 }}
    />
    <TouchableOpacity style={styles.forgotButton} onPress={onCancel}>
      <Text style={styles.forgotText}>Back to Sign In</Text>
    </TouchableOpacity>
  </View>
);

export default RecoveryForm;
