import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import { Button } from 'kitsu/components/Button/';
import { Input } from 'kitsu/components/Input';
import { PasswordInput } from 'kitsu/components/PasswordInput';
import * as colors from 'kitsu/constants/colors';
import styles from './styles';
import I18n from 'kitsu/translations/i18n';

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
      placeholder={I18n.t("components.account.email")}
      autoCapitalize="none"
      autoCorrect={false}
      value={data.email}
      keyboardType={'email-address'}
      onChangeText={text => handleChange(text, 'email')}
    />
    <PasswordInput
      placeholder={I18n.t("components.account.password")}
      value={data.password}
      onChangeText={text => handleChange(text, 'password')}
    />
    <Button
      loading={loading}
      title={I18n.t("components.account.signin")}
      onPress={() => onSubmit()}
      style={{ marginTop: 10 }}
    />
    <Button
      style={styles.buttonFacebook}
      title={I18n.t("components.account.facebook")}
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
