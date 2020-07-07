import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import { Button } from 'kitsu/components/Button/';
import { Input } from 'kitsu/components/Input';
import { PasswordInput } from 'kitsu/components/PasswordInput';
import styles from './styles';
import I18n from 'kitsu/translations/i18n';

const SignupForm = ({
  handleChange,
  data,
  onSubmit,
  loading,
  onSignInFacebook,
  signingInFacebook,
  onPressTerms,
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
    <Input
      placeholder={I18n.t("components.account.username")}
      autoCapitalize="none"
      autoCorrect={false}
      value={data.username}
      onChangeText={text => handleChange(text, 'username')}
    />
    <PasswordInput
      placeholder={I18n.t("components.account.password")}
      value={data.password}
      onChangeText={text => handleChange(text, 'password')}
    />
    <PasswordInput
      placeholder={I18n.t("components.account.confirmpassword")}
      value={data.confirmPassword}
      onChangeText={text => handleChange(text, 'confirmPassword')}
    />
    <Button
      loading={loading}
      title={I18n.t("components.account.create")}
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
    <View style={styles.termsWrapper}>
      <Text style={styles.terms}>{I18n.t("components.account.termspart1")}</Text>
      <TouchableOpacity onPress={onPressTerms}>
        <Text style={[styles.terms, styles.termsHightlight]}>{I18n.t("components.account.termspart2")}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

SignupForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  signingInFacebook: PropTypes.bool.isRequired,
  onSignInFacebook: PropTypes.func.isRequired,
  birthday: PropTypes.string.isRequired,
  isBirthdaySet: PropTypes.bool.isRequired,
  onPressTerms: PropTypes.func.isRequired,
};

export default SignupForm;
