import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import * as colors from 'app/constants/colors';
import RecoveryForm from 'app/components/Forms/RecoveryForm';
import { Toast } from 'app/components/Toast';
import { loginUser } from 'app/store/auth/actions';
import { Navigation } from 'react-native-navigation';
import { kitsuConfig } from 'app/config/env';
import AuthWrapper from './AuthWrapper';
import styles from './styles';

class RecoveryScreen extends Component {
  state = {
    email: '',
    loading: false,
    toastVisible: false,
    toastTitle: '',
  };

  onDismiss = () => {
    Navigation.pop(this.props.componentId);
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
              onCancel={this.onDismiss}
            />
          </View>
        </AuthWrapper>
      </View>
    );
  }
}

RecoveryScreen.propTypes = {
  signingIn: PropTypes.bool.isRequired,
  componentId: PropTypes.any.isRequired,
};

RecoveryScreen.defaultProps = {
  loginError: '',
};

const mapStateToProps = ({ auth }) => {
  const { signingIn, loginError } = auth;
  return { signingIn, loginError };
};

export default connect(mapStateToProps, { loginUser })(RecoveryScreen);
