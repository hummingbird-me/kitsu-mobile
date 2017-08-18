import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import * as colors from 'kitsu/constants/colors';
import RecoveryForm from 'kitsu/components/Forms/RecoveryForm';
import { loginUser } from 'kitsu/store/auth/actions';
import AuthWrapper from './AuthWrapper';

class RecoveryScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(isFb) {
    const { username, password } = this.state;
    const { navigation } = this.props;
  }

  handleChange(text, name) {
    this.setState({ [name]: text });
  }

  render() {
    return (
      <AuthWrapper loading={this.props.signingIn} onSuccess={this.onSubmit}>
        <View style={{ padding: 20, paddingLeft: 25, paddingTop: 15, paddingBottom: 0 }}>
          <Text style={{ fontSize: 14, lineHeight: 19, color: 'white', fontFamily: 'Asap-Bold' }}>
            Reset password
          </Text>
          <Text style={{ fontSize: 12, lineHeight: 17, color: 'white', paddingTop: 10, fontFamily: 'OpenSans'}}>
            Don’t worry, we’ve been there. Enter your email below and we’ll
            get you running again in no time!
          </Text>
        </View>
        <RecoveryForm
          data={this.state}
          handleChange={this.handleChange}
          onSubmit={this.onSubmit}
          loading={this.props.signingIn || this.state.loading}
        />
        <View style={{ padding: 20, paddingLeft: 25, paddingTop: 15 }}>
          <Text
            style={{
              color: colors.white,
              opacity: 0.5,
              lineHeight: 17,
              fontSize: 12,
              fontFamily: 'OpenSans',
              textAlign: 'center',
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
            Remember what it was?
            <Text
              style={{
                color: colors.white,
                fontFamily: 'OpenSans-Bold',
              }}
            >
              {' '}Sign in
            </Text>
          </Text>
        </View>
        <View style={{ padding: 20, paddingLeft: 25, paddingTop: 40 }}>
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
                  actions: [NavigationActions.navigate({ routeName: 'Signup' })],
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
              Need an account?
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  color: 'rgba(255,255,255,0.5)',
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

RecoveryScreen.propTypes = {
  signingIn: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
};

RecoveryScreen.defaultProps = {
  loginError: '',
};

const mapStateToProps = ({ auth }) => {
  const { signingIn, loginError } = auth;
  return { signingIn, loginError };
};

export default connect(mapStateToProps, { loginUser })(RecoveryScreen);
