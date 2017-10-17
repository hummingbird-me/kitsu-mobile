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
import styles from './styles';

class RecoveryScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  state = {
    email: '',
    loading: false,
  };


  onReset = () => {
    // TODO: implement this function
    // const { username, password } = this.state;
    // const { navigation } = this.props;
  }

  handleChange = (text, name) => {
    this.setState({ [name]: text });
  }

  render() {
    return (
      <View style={styles.container}>
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
