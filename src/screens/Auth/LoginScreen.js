import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';

import * as colors from '../../constants/colors';
import LoginForm from '../../components/Forms/LoginForm';
import { loginUser } from '../../store/auth/actions';
import AuthWrapper from './AuthWrapper';

class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  state = {
    username: '',
    password: '',
    loading: false,
  };

  onSubmit = (isFb) => {
    const { username, password } = this.state;
    const { navigation } = this.props;
    if (isFb) {
      this.props.loginUser(null, navigation);
    } else if (username.length > 0 && password.length > 0) {
      this.props.loginUser({ username, password }, navigation);
    }
  };

  handleChange = (text, name) => {
    this.setState({ [name]: text });
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <AuthWrapper loading={this.props.signingIn} onSuccess={this.onSubmit}>
        <LoginForm
          data={this.state}
          handleChange={this.handleChange}
          onSubmit={() => this.onSubmit()}
          loading={this.props.signingIn || this.state.loading}
        />
        <View style={{ padding: 20, paddingLeft: 25, paddingTop: 15 }}>
          {this.props.loginError
            ? <Text
              style={{
                color: 'red',
                paddingBottom: 10,
                textAlign: 'center',
              }}
            >
              {this.props.loginError}
            </Text>
            : null}
          <Text
            onPress={() => navigate('Recovery')}
            style={{
              color: colors.white,
              opacity: 0.6,
              lineHeight: 17,
              fontSize: 12,
              fontFamily: 'OpenSans',
              textAlign: 'center',
            }}
          >
            Forgot your password?
          </Text>
        </View>
        <View style={{ padding: 20, paddingLeft: 25, paddingTop: 45 }}>
          <Button
            block
            bordered
            light
            style={{
              height: 34,
              borderWidth: 0.6,
              borderColor: 'rgba(255,255,255,0.3)',
              borderRadius: 3,
            }}
            onPress={() => navigate('Signup')}
          >
            <Text
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'OpenSans',
                lineHeight: 20,
                fontSize: 12,
              }}
            >
              Need an account?
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                }}
              >
                {' '}Create one
              </Text>
            </Text>
          </Button>
        </View>
      </AuthWrapper>
    );
  }
}

LoginScreen.propTypes = {
  loginUser: PropTypes.func.isRequired,
  loginError: PropTypes.string,
  signingIn: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
};

LoginScreen.defaultProps = {
  loginError: '',
};

const mapStateToProps = ({ auth }) => {
  const { signingIn, loginError } = auth;
  return { signingIn, loginError };
};

export default connect(mapStateToProps, { loginUser })(LoginScreen);
