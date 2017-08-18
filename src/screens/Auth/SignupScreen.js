import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import SignupForm from 'kitsu/components/Forms/SignupForm';
import { loginUser } from 'kitsu/store/auth/actions';
import { createUser } from 'kitsu/store/user/actions';
import AuthWrapper from './AuthWrapper';

class SignupScreen extends Component {
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
    this.populateFB = this.populateFB.bind(this);
  }

  componentDidMount() {
    if (this.props.fbuser.name) {
      this.populateFB(this.props.fbuser);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fbuser.name && nextProps.fbuser.name !== this.props.fbuser.name) {
      this.populateFB(nextProps.fbuser);
    }
  }
  onSubmit(isFb, data) {
    const { navigation } = this.props;
    if (isFb) {
      this.props.loginUser(null, navigation, 'signup');
    } else {
      this.setState({ ...data });
      this.props.createUser(data, navigation);
      // this.props.loginUser({ username, password }, navigation);
    }
  }

  populateFB(fbuser) {
    const { name, email } = fbuser;
    if (name) {
      const username = name.replace(' ', '_').toLowerCase();
      this.setState({ username, email });
    }
  }

  handleChange(text, name) {
    this.setState({ [name]: text });
  }

  render() {
    const { signingIn, loadFBuser, signingUp, loginError, signupError, navigation } = this.props;
    return (
      <AuthWrapper loading={signingIn || loadFBuser} onSuccess={this.onSubmit}>
        <SignupForm
          data={this.state}
          handleChange={this.handleChange}
          onSubmit={data => this.onSubmit(false, data)}
          loading={signingUp || loadFBuser}
          errors={signupError}
        />
        <View style={{ padding: 20, paddingLeft: 25, paddingTop: 15 }}>
          {loginError
            ? <Text
              style={{
                color: 'red',
                paddingBottom: 10,
                textAlign: 'center',
              }}
            >
              {loginError}
            </Text>
            : null}
        </View>
        <View style={{ padding: 20, paddingLeft: 25, paddingTop: 20 }}>
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
              navigation.dispatch(
                NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'Login' })],
                  key: null,
                }),
              )}
          >
            <Text
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'OpenSans',
                lineHeight: 20,
                fontSize: 12,
              }}
            >
              Already have an account?
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
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

SignupScreen.propTypes = {
  loginUser: PropTypes.func.isRequired,
  createUser: PropTypes.func.isRequired,
  loginError: PropTypes.string,
  signupError: PropTypes.object,
  signingIn: PropTypes.bool.isRequired,
  signingUp: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  fbuser: PropTypes.object.isRequired,
  loadFBuser: PropTypes.bool.isRequired,
};

SignupScreen.defaultProps = {
  loginError: '',
  signupError: {},
};

const mapStateToProps = ({ user, auth }) => {
  const { signingUp, signupError } = user;
  const { signingIn, loadFBuser, fbuser } = auth;
  return { signingUp, signingIn, signupError, loadFBuser, fbuser };
};

export default connect(mapStateToProps, { loginUser, createUser })(SignupScreen);
