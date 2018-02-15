import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import * as colors from 'kitsu/constants/colors';
import RecoveryForm from 'kitsu/components/Forms/RecoveryForm';
import { Toast } from 'kitsu/components/Toast';
import { loginUser } from 'kitsu/store/auth/actions';
import AuthWrapper from './AuthWrapper';
import { kitsuConfig } from 'kitsu/config/env';
import styles from './styles';

class RecoveryScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  state = {
    email: '',
    loading: false,
    toastVisible: false,
    toastTitle: '',
  };

  onDismiss = () => {
    this.props.navigation.goBack();
  }

  onReset = async () => {
    if (!this.state.email) { return; }
    try {
      await fetch(`${kitsuConfig.baseUrl}/edge/users/_recover`, {
        method: 'POST',
        body: JSON.stringify({ username: this.state.email }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      }).then((res) => {
        if (!res.ok) { throw new Error(res); }
      });

      this.setState({
        toastVisible: true,
        toastTitle: 'Your password reset email has been sent.'
      });
    } catch (err) {
      console.log(err);
    }
  }

  handleChange = (text, name) => {
    this.setState({ [name]: text });
  }

  render() {
    return (
      <View style={styles.container}>
        <Toast
          visible={this.state.toastVisible}
          title={this.state.toastTitle}
          onDismiss={this.onDismiss}
          onRequestClose={this.onDismiss}
          style={{ backgroundColor: colors.blue }}
        />
        <AuthWrapper>
          <View style={styles.forgotTextWrapper}>
            <Text style={styles.forgotTitle}>
              Forgot your Password?
            </Text>
            <Text style={styles.forgotDescription}>
              There are worse things to forget. Enter your email below and we{'\''}ll get that reset code for you.
            </Text>
          </View>
          <View style={[styles.formsWrapper, { marginTop: 0, marginBottom: 16 }]}>
            <RecoveryForm
              data={this.state}
              handleChange={this.handleChange}
              onReset={this.onReset}
              loading={this.props.signingIn || this.state.loading}
            />
          </View>
        </AuthWrapper>
      </View>
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
