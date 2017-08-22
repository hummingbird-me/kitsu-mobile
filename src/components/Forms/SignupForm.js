import React from 'react';
import { View, Text } from 'react-native';
import { PropTypes } from 'prop-types';
import { Button, Spinner } from 'native-base';
import t from 'tcomb-form-native';
import * as colors from 'kitsu/constants/colors';
import textbox from './tcomb/textbox';

const { Form } = t.form;

const Signup = t.struct({
  username: t.String,
  email: t.refinement(t.String, s => /\S+@\S+\.\S+/.test(s)),
  password: t.refinement(t.String, s => s.length > 7),
});

let form = null;

const onPress = (onSubmit) => {
  const data = form.getValue();
  if (data) {
    onSubmit(data);
  }
};

const SignupForm = ({ onSubmit, loading, data, errors }) => {
  const options = {
    fields: {
      username: {
        placeholderTextColor: 'rgba(255,255,254,0.5)',
        template: textbox,
        label: 'username-icon',
        autoCapitalize: 'none',
        hasError: Boolean(errors.name),
        error: errors.name || 'Field should not be empty',
      },
      email: {
        placeholderTextColor: 'rgba(255,255,254,0.5)',
        template: textbox,
        label: 'mail-icon',
        autoCapitalize: 'none',
        hasError: Boolean(errors.email),
        error: errors.email || 'Insert a valid email',
      },
      password: {
        password: true,
        secureTextEntry: true,
        label: 'password-icon',
        placeholderTextColor: 'rgba(255,255,254,0.5)',
        template: textbox,
        hasError: Boolean(errors.password),
        error: errors.password || 'Password must be at least 8 digits',
      },
    },
    auto: 'placeholders',
  };
  return (
    <View>
      <View style={{ padding: 25, paddingBottom: 20, paddingTop: 30 }}>
        <Form ref={el => (form = el)} type={Signup} options={options} value={data} />
      </View>
      <View style={{ padding: 10, paddingLeft: 25, paddingRight: 25 }}>
        <Button
          block
          disabled={loading}
          onPress={() => onPress(onSubmit)}
          style={{
            backgroundColor: colors.green,
            height: 47,
            borderRadius: 3,
          }}
        >
          {loading
            ? <Spinner size="small" color="rgba(255,255,255,0.4)" />
            : <Text
              style={{
                color: colors.white,
                fontFamily: 'OpenSans-Semibold',
                lineHeight: 20,
                fontSize: 15,
              }}
            >
                Create your account
              </Text>}
        </Button>
      </View>
    </View>
  );
};

SignupForm.propTypes = {
  data: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object,
};

SignupForm.defaultProps = {
  errors: {},
};

export default SignupForm;
