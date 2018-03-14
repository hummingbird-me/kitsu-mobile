import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import { Button } from 'kitsu/components/Button/';
import { Input } from 'kitsu/components/Input';
import styles from './styles';

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
      placeholder="Email"
      autoCapitalize="none"
      autoCorrect={false}
      value={data.email}
      keyboardType={'email-address'}
      onChangeText={text => handleChange(text, 'email')}
    />
    <Input
      placeholder="Username"
      autoCapitalize="none"
      autoCorrect={false}
      value={data.username}
      onChangeText={text => handleChange(text, 'username')}
    />
    <Input
      placeholder="Password"
      secureTextEntry
      value={data.password}
      onChangeText={text => handleChange(text, 'password')}
    />
    <Input
      placeholder="Confirm Password"
      secureTextEntry
      value={data.confirmPassword}
      onChangeText={text => handleChange(text, 'confirmPassword')}
      autoCapitalize="none"
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
        <Text style={[styles.terms, styles.termsHightlight]}>Terms of Service</Text>
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
