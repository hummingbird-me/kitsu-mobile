import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import { Button } from 'kitsu/components/Button/';
import { Input } from 'kitsu/components/Input';
import * as colors from 'kitsu/constants/colors';
import styles from './styles';

const LoginForm = ({
  handleChange,
  data,
  onSubmit,
  loading,
  onSignInFacebook,
  signingInFacebook,
  onForgotPassword,
}) => (
  <View>
    <Input
      placeholder="Email"
      autoCapitalize="none"
      autoCorrect={false}
      value={data.email}
      keyboardType={'email-address'}
      onChangeText={text => handleChange(text, 'email')}
    />
    <Input
      placeholder="Password"
      secureTextEntry
      value={data.password}
      onChangeText={text => handleChange(text, 'password')}
      autoCapitalize="none"
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

LoginForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  signingInFacebook: PropTypes.bool.isRequired,
  onSignInFacebook: PropTypes.func.isRequired,
  onForgotPassword: PropTypes.func.isRequired,
};
export default LoginForm;
