import React from 'react';
import { View, Text } from 'react-native';
import { PropTypes } from 'prop-types';
import { Button } from 'kitsu/components/Button/';
import { Input } from 'kitsu/components/Input';
import styles from './styles';

const SignupForm = ({ handleChange, data, onSubmit, loading, onSignInFacebook, signingInFacebook }) => (
  <View>
    <Input
      placeholder="Email"
      autoCapitalize="none"
      autoCorrect={false}
      value={data.email}
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
    <Text style={{ marginVertical: 16, textAlign: 'center', fontSize: 12, color: 'grey' }}>By creating an account, you agree our <Text style={{ fontWeight: 'bold' }}>Terms of Service</Text></Text>
  </View>
);

SignupForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  signingInFacebook: PropTypes.bool.isRequired,
  onSignInFacebook: PropTypes.func.isRequired,
};

export default SignupForm;
