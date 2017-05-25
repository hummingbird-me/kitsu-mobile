import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import RegisterForm from '../../components/Forms/RegisterForm';
import { loginUser } from '../../store/auth/actions';
import AuthWrapper from './AuthWrapper';

class RegistrationScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(isFb) {
    const { username, password, email } = this.state;
    const { navigation } = this.props;
    console.log(this.state);
    if (isFb) {
      this.props.loginUser(null, navigation);
    } else if (username.length > 0 && password.length > 0) {
      // this.props.loginUser({ username, password }, navigation);
    }
  }

  handleChange(text, name) {
    this.setState({ [name]: text });
  }

  render() {
    return (
      <AuthWrapper loading={this.props.signingIn} onSuccess={this.onSubmit}>
        <RegisterForm
          data={this.state}
          handleChange={this.handleChange}
          onSubmit={() => this.onSubmit()}
          loading={this.props.signingIn}
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
        </View>
        <View style={{ padding: 20, paddingLeft: 25, paddingTop: 52 }}>
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
            onPress={() =>
              this.props.navigation.dispatch(
                NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'Login' })],
                  key: null,
                }),
              )}
          >
            <Text
              style={{
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'OpenSans',
                fontWeight: '600',
                lineHeight: 20,
                fontSize: 12,
              }}
            >
              Already have an account?
              <Text
                style={{
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {' '}Login
              </Text>
            </Text>
          </Button>
        </View>
      </AuthWrapper>
    );
  }
}

RegistrationScreen.propTypes = {
  loginUser: PropTypes.func.isRequired,
  loginError: PropTypes.string,
  signingIn: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
};

RegistrationScreen.defaultProps = {
  loginError: '',
};

const mapStateToProps = ({ auth }) => {
  const { signingIn, loginError } = auth;
  return { signingIn, loginError };
};

export default connect(mapStateToProps, { loginUser })(RegistrationScreen);
