import React from 'react';
import { View, Text } from 'react-native';
import { PropTypes } from 'prop-types';
import { Form, Input, Item, Button, Spinner } from 'native-base';
import * as colors from 'kitsu/constants/colors';
import CustomIcon from 'kitsu/components/Icon';


const LoginForm = ({ handleChange, data, onSubmit, loading }) => (
  <View>
    <Form style={{ padding: 20, paddingLeft: 10 }}>
      <Item
        style={{
          borderBottomColor: 'rgba(255,255,255,0.2)',
          borderBottomWidth: 0.5,
        }}
      >
        <View style={{ width: 25, justifyContent: 'center', alignItems: 'center' }}>
          <CustomIcon name="mail-icon" size={13} color="white" styles={{ opacity: 0.5 }} />
        </View>
        <Input
          placeholder="Email or Username"
          placeholderTextColor="rgba(255,255,254,0.5)"
          autoCapitalize="none"
          value={data.username}
          onChangeText={text => handleChange(text, 'username')}
          style={{
            fontSize: 15,
            fontFamily: 'OpenSans',
            color: 'rgba(255,255,255,0.7)',
          }}
        />
      </Item>
      <Item
        style={{
          borderBottomColor: 'rgba(255,255,255,0.2)',
          borderBottomWidth: 0.5,
          paddingTop: 10,
        }}
      >
        <View style={{ width: 25, justifyContent: 'center', alignItems: 'center' }}>
          <CustomIcon name="password-icon" size={18} color="white" styles={{ opacity: 0.5 }} />
        </View>
        <Input
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.5)"
          secureTextEntry
          value={data.password}
          onChangeText={text => handleChange(text, 'password')}
          autoCapitalize="none"
          style={{
            fontSize: 15,
            fontFamily: 'OpenSans',
            color: 'rgba(255,255,255,0.7)',
          }}
        />
      </Item>
    </Form>
    <View style={{ padding: 10, paddingLeft: 25, paddingRight: 25 }}>
      <Button
        block
        disabled={loading}
        onPress={onSubmit}
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
              Sign in to your account
            </Text>}
      </Button>
    </View>
  </View>
);

LoginForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default LoginForm;
