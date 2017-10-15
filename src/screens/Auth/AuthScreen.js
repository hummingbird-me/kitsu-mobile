import React from 'react';
import { View, TouchableOpacity, Text, Image, Platform, LayoutAnimation, UIManager } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import * as colors from 'kitsu/constants/colors';
import { slidelogo } from 'kitsu/assets/img/onboarding/';
import { connect } from 'react-redux';
import SignupForm from 'kitsu/components/Forms/SignupForm';
import LoginForm from 'kitsu/components/Forms/LoginForm';
import AnimatedWrapper from 'kitsu/components/AnimatedWrapper';
import { loginUser } from 'kitsu/store/auth/actions';
import { createUser } from 'kitsu/store/user/actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

class AuthScreen extends React.Component {
  state = {
    authType: this.props.navigation.state.params.authType,
    loading: false,
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
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

  onSubmitSignup = (isFb) => {
    const { navigation } = this.props;
    const { email, username, password } = this.state;
    if (isFb) {
      this.props.loginUser(null, navigation, 'signup');
    } else {
      this.props.createUser({ email, username, password }, navigation);
    }
  }

  onSubmitLogin = () => {
    const { username, password } = this.state;
    const { navigation } = this.props;
    if (username.length > 0 && password.length > 0) {
      this.props.loginUser({ username, password }, navigation);
    } else {
      this.props.loginUser(null, navigation);
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
        console.log(`Login fail with error: ${error}`);
      },
    );
  };

  populateFB = (fbuser) => {
    const { name, email } = fbuser;
    if (name) {
      const username = name.replace(' ', '_').toLowerCase();
      this.setState({ username, email });
    }
  }

  handleChange = (text, name) => {
    this.setState({ [name]: text });
  }

  switchForm = (authType) => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ authType });
  }

  render() {
    const { signingIn, signingUp, loadFBuser } = this.props;
    const { authType, loading } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView extraHeight={80} contentContainerStyle={styles.stretch} scrollEnabled={Platform.select({ ios: false, android: true })}>
          <View style={styles.stretch}>
            <AnimatedWrapper />
            <Image
              style={styles.logo}
              resizeMode={'contain'}
              source={slidelogo}
            />
          </View>
          <View>
            <View style={styles.tabsWrapper}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.tab}
                onPress={() => this.switchForm('signup')}
              >
                <Text style={[styles.tabTitle, authType === 'signup' ? { color: colors.tabRed } : {}]}>
                  Sign up
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.tab}
                onPress={() => this.switchForm('login')}
              >
                <Text style={[styles.tabTitle, authType === 'login' ? { color: colors.tabRed } : {}]}>
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
                />
              ) : (
                <LoginForm
                  data={this.state}
                  handleChange={this.handleChange}
                  onSubmit={this.onSubmitLogin}
                  loading={signingIn || loading}
                  signingInFacebook={loadFBuser}
                  onSignInFacebook={this.onSignInFacebook}
                />
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user, auth }) => {
  const { signingUp, signupError } = user;
  const { signingIn, loadFBuser, fbuser } = auth;
  return { signingUp, signingIn, signupError, loadFBuser, fbuser };
};


export default connect(mapStateToProps, { loginUser, createUser })(AuthScreen);
