import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { PropTypes } from 'prop-types';
import { Input, Item, Button, Spinner } from 'native-base';
import _ from 'lodash';
import t from 'tcomb-form-native';
import * as colors from '../../constants/colors';
import textbox from './tcomb/textbox';
import withSpinner from '../../utils/withSpinner';

const { Form } = t.form;

const Signup = t.struct({
  username: t.String,
  email: t.refinement(t.String, s => /\S+@\S+\.\S+/.test(s)),
  password: t.refinement(t.String, s => s.length > 7),
});

let form = null;

const onPress = (onSubmit) => {
  const data = form.getValue();
  console.log(data);
  if (data) {
    onSubmit(data);
  }
};

const onChange = (data) => {
  console.log(data);
};

const SignupForm = ({ onSubmit, loading, data, errors }) => {
  const options = {
    fields: {
      username: {
        placeholderTextColor: 'rgba(255,255,254,0.5)',
        template: textbox,
        label: 'mail-icon',
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
        <Form
          ref={el => (form = el)}
          type={Signup}
          options={options}
          value={data}
          onChange={onChange}
        />
      </View>
      <View style={{ padding: 10, paddingLeft: 25, paddingRight: 25 }}>
        <Button
          block
          disabled={loading}
          onPress={() => onPress(onSubmit)}
          style={{
            backgroundColor: colors.lightGreen,
            height: 47,
            borderRadius: 3,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontWeight: '600',
              fontFamily: 'OpenSans',
              lineHeight: 20,
              fontSize: 15,
            }}
          >
            Create your account
          </Text>
        </Button>
      </View>
    </View>
  );
};

SignupForm.propTypes = {
  data: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default withSpinner(SignupForm);
