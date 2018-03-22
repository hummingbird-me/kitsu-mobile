import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  LayoutAnimation,
  UIManager,
  DatePickerAndroid,
  DatePickerIOS,
  Linking,
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import * as colors from 'kitsu/constants/colors';
import { connect } from 'react-redux';
import { Modal } from 'kitsu/components/Modal';
import { Toast } from 'kitsu/components/Toast';
import SignupForm from 'kitsu/components/Forms/SignupForm';
import LoginForm from 'kitsu/components/Forms/LoginForm';
import { loginUser } from 'kitsu/store/auth/actions';
import { createUser } from 'kitsu/store/user/actions';
import { TERMS_URL } from 'kitsu/constants/app';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { Sentry } from 'react-native-sentry';
import AuthWrapper from './AuthWrapper';
import styles from './styles';

class AuthScreen extends React.Component {
  state = {
    authType: this.props.navigation.state.params.authType,
    loading: false,
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    toastVisible: false,
    toastTitle: '',
  };

  componentDidMount() {
    if (this.props.fbuser && this.props.fbuser.name) {
      this.populateFB(this.props.fbuser);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { signingIn, signingUp, loginError, signupError, fbuser } = nextProps;
    if (fbuser && fbuser.name && fbuser.name !== (this.props.fbuser && this.props.fbuser.name)) {
      this.populateFB(fbuser);
    }
    // current login/signup process triggers falsy toast
    if (!signingUp && !signingIn && signupError && signupError[0]) {
      this.setState({
        toastVisible: true,
        toastTitle: signupError[0].title,
      });
    }
    if (!signingUp && !signingIn && loginError) {
      this.setState({
        toastVisible: true,
        toastTitle: loginError,
      });
    }
  }

  onSubmitSignup = (isFb) => {
    const { navigation } = this.props;
    const { email, username, password, confirmPassword } = this.state;
    if (isFb) {
      this.props.loginUser(null, navigation, 'login');
    } else if (
      isEmpty(email) ||
      isEmpty(username) ||
      isEmpty(password) ||
      isEmpty(confirmPassword)
    ) {
      this.setState({
        toastTitle: "Inputs can't be blank",
        toastVisible: true,
      });
    } else if (confirmPassword !== password) {
      this.setState({
        toastTitle: 'Passwords do not match',
        toastVisible: true,
      });
    } else {
      this.props.createUser({ email, username, password }, navigation);
    }
  };

  onSubmitLogin = () => {
    const { email, password } = this.state;
    const { navigation } = this.props;
    if (isEmpty(email) || isEmpty(password)) {
      this.setState({
        toastTitle: "Inputs can't be blank",
        toastVisible: true,
      });
    } else {
      this.props.loginUser({ email, password }, navigation);
    }
  };

  onSignInFacebook = () => {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      (result) => {
        if (!result.isCancelled) {
          this.onSubmitSignup(true);
        }
      },
      (error) => {
        Sentry.captureMessage('FBSDK - Facebook Login Failed', {
          extra: {
            error,
          },
        });
        console.log(`Login fail with error: ${error}`);
      },
    );
  };

  onForgotPassword = () => {
    this.props.navigation.navigate('Recovery');
  };

  onDismiss = () => {
    this.setState({ toastVisible: false });
  };

  onPressTerms = () => {
    Linking.openURL(TERMS_URL).catch(err => console.log('An error occurred', err));
  };

  populateFB = (fbuser) => {
    const { name, email } = fbuser;
    if (name) {
      const username = name.replace(' ', '_').toLowerCase();
      this.setState({ username, email });
    }
  };

  handleChange = (text, name) => {
    this.setState({ [name]: text });
  };

  switchForm = (authType) => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ authType });
  };

  render() {
    const { signingIn, signingUp, loadFBuser } = this.props;
    const {
      authType,
      loading,
      toastVisible,
      toastTitle,
    } = this.state;
    return (
      <View style={styles.container}>
        <AuthWrapper>
          <View>
            <View style={styles.tabsWrapper}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.tab}
                onPress={() => this.switchForm('signup')}
              >
                <Text
                  style={[styles.tabTitle, authType === 'signup' ? { color: colors.tabRed } : {}]}
                >
                  Sign up
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.tab}
                onPress={() => this.switchForm('login')}
              >
                <Text
                  style={[styles.tabTitle, authType === 'login' ? { color: colors.tabRed } : {}]}
                >
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formsWrapper}>
              {authType === 'signup' ? (
                <SignupForm
                  data={this.state}
                  handleChange={this.handleChange}
                  onSubmit={this.onSubmitSignup}
                  loading={signingUp || loading}
                  signingInFacebook={loadFBuser}
                  onSignInFacebook={this.onSignInFacebook}
                  onPressTerms={this.onPressTerms}
                />
              ) : (
                <LoginForm
                  data={this.state}
                  handleChange={this.handleChange}
                  onSubmit={this.onSubmitLogin}
                  loading={signingIn || loading}
                  signingInFacebook={loadFBuser}
                  onSignInFacebook={this.onSignInFacebook}
                  onForgotPassword={this.onForgotPassword}
                />
              )}
            </View>
          </View>
        </AuthWrapper>
        <Toast
          visible={toastVisible}
          title={toastTitle}
          onDismiss={this.onDismiss}
          onRequestClose={this.onDismiss}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ user, auth }) => {
  const { signingUp, signupError } = user;
  const { signingIn, loadFBuser, fbuser, loginError } = auth;
  return { signingUp, signingIn, signupError, loadFBuser, fbuser, loginError };
};

export default connect(mapStateToProps, { loginUser, createUser })(AuthScreen);
