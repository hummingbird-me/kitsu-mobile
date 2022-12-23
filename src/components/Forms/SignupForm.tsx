import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Button } from 'kitsu/components/Button/';
import { Input } from 'kitsu/components/Input';
import { PasswordInput } from 'kitsu/components/PasswordInput';

import styles from './styles';

interface SignupFormProps {
  handleChange(...args: unknown[]): unknown;
  data: object;
  onSubmit(...args: unknown[]): unknown;
  loading: boolean;
  signingInFacebook: boolean;
  onSignInFacebook(...args: unknown[]): unknown;
  birthday: string;
  isBirthdaySet: boolean;
  onPressTerms(...args: unknown[]): unknown;
}

const SignupForm = ({
  handleChange,
  data,
  onSubmit,
  loading,
  onSignInFacebook,
  signingInFacebook,
  onPressTerms,
}: SignupFormProps) => (
  <View>
    <Input
      placeholder="Email"
      autoCapitalize="none"
      autoCorrect={false}
      value={data.email}
      keyboardType={'email-address'}
      onChangeText={(text) => handleChange(text, 'email')}
    />
    <Input
      placeholder="Username"
      autoCapitalize="none"
      autoCorrect={false}
      value={data.username}
      onChangeText={(text) => handleChange(text, 'username')}
    />
    <PasswordInput
      placeholder="Password"
      value={data.password}
      onChangeText={(text) => handleChange(text, 'password')}
    />
    <PasswordInput
      placeholder="Confirm Password"
      value={data.confirmPassword}
      onChangeText={(text) => handleChange(text, 'confirmPassword')}
    />
    <Button
      loading={loading}
      title={'Create account'}
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
    <View style={styles.termsWrapper}>
      <Text style={styles.terms}>By creating an account, you agree our </Text>
      <TouchableOpacity onPress={onPressTerms}>
        <Text style={[styles.terms, styles.termsHightlight]}>
          Terms of Service
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default SignupForm;
