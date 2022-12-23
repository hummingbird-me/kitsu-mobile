import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'kitsu/components/Button/';
import { Input } from 'kitsu/components/Input';
import { PasswordInput } from 'kitsu/components/PasswordInput';
import * as colors from 'kitsu/constants/colors';
import styles from './styles';

interface LoginFormProps {
  handleChange(...args: unknown[]): unknown;
  data: object;
  onSubmit(...args: unknown[]): unknown;
  loading: boolean;
  signingInFacebook: boolean;
  onSignInFacebook(...args: unknown[]): unknown;
  onForgotPassword(...args: unknown[]): unknown;
}

const LoginForm = ({
  handleChange,
  data,
  onSubmit,
  loading,
  onSignInFacebook,
  signingInFacebook,
  onForgotPassword
}: LoginFormProps) => (
  <View>
    <Input
      placeholder="Email"
      autoCapitalize="none"
      autoCorrect={false}
      value={data.email}
      keyboardType={'email-address'}
      onChangeText={text => handleChange(text, 'email')}
    />
    <PasswordInput
      placeholder="Password"
      value={data.password}
      onChangeText={text => handleChange(text, 'password')}
    />
    <Button
      loading={loading}
      title={'Sign in to your account'}
      onPress={() => onSubmit()}
      style={{ marginTop: 10 }}
    />
    <Button
      style={styles.buttonFacebook}
      title={'Login with Facebook'}
      icon={'facebook-official'}
      loading={signingInFacebook}
      onPress={onSignInFacebook}
    />
    <TouchableOpacity style={styles.forgotButton} onPress={onForgotPassword}>
      <Text style={styles.forgotText}>Forgot password</Text>
    </TouchableOpacity>
  </View>
);

export default LoginForm;
