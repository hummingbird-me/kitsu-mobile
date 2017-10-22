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
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import AuthWrapper from './AuthWrapper';
import styles from './styles';

const MINIMUM_DATE = new Date(moment().subtract(100, 'years'));
const MAXIMUM_DATE = new Date(moment().subtract(13, 'years'));

class AuthScreen extends React.Component {
  state = {
    authType: this.props.navigation.state.params.authType,
    loading: false,
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    birthday: MAXIMUM_DATE,
    isBirthdaySet: false,
    showDateModalIOS: false,
    toastVisible: false,
    toastTitle: '',
  };

  componentDidMount() {
    if (this.props.fbuser.name) {
      this.populateFB(this.props.fbuser);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fbuser.name && nextProps.fbuser.name !== this.props.fbuser.name) {
      this.populateFB(nextProps.fbuser);
    }
    if (nextProps.signupError && nextProps.signupError[0]) {
      this.setState({
        toastVisible: true,
        toastTitle: nextProps.signupError[0].title,
      });
    }
  }

  onSubmitSignup = (isFb) => {
    const { navigation } = this.props;
    const { email, username, password, confirmPassword, birthday, isBirthdaySet } = this.state;
    if (
      isEmpty(email) ||
      isEmpty(username) ||
      isEmpty(password) ||
      isEmpty(confirmPassword) ||
      !isBirthdaySet
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
      const ISOBirthday = new Date(moment(birthday).format('YYYY-MM-DD')).toISOString(); // remove offsets caused by timezones.
      if (isFb) {
        this.props.loginUser(null, navigation, 'signup');
      } else {
        this.props.createUser({ email, username, password, birthday: ISOBirthday }, navigation);
      }
    }
  };

  onSubmitLogin = () => {
    const { username, password } = this.state;
    const { navigation } = this.props;
    if (isEmpty(username) || isEmpty(password)) {
      this.setState({
        toastTitle: "Inputs can't be blank",
        toastVisible: true,
      });
    } else {
      this.props.loginUser({ username, password }, navigation);
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

  onForgotPassword = () => {
    this.props.navigation.navigate('Recovery');
  };

  onBirthdayButtonPressed = async () => {
    if (Platform.OS === 'android') {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          // Use `new Date()` for current date.
          // May 25 2020. Month 0 is January.
          minDate: MINIMUM_DATE,
          maxDate: MAXIMUM_DATE,
          date: MAXIMUM_DATE,
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          // Selected year, month (0-11), day
          this.setState({
            birthday: new Date(year, month, day),
            isBirthdaySet: true,
          });
        }
      } catch ({ code, message }) {
        console.warn('Cannot open date picker', message);
      }
    } else {
      this.setState({ showDateModalIOS: true });
    }
  };

  onDateModalIOSConfirm = () => {
    this.setState({
      showDateModalIOS: false,
      isBirthdaySet: true,
    });
  };

  onDateModalIOSCancel = () => {
    this.setState({ showDateModalIOS: false });
  };

  onDismiss = () => {
    this.setState({ toastVisible: false });
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
      birthday,
      isBirthdaySet,
      loading,
      showDateModalIOS,
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
                  birthday={isBirthdaySet ? birthday.toLocaleDateString() : 'Birthday'} // Placeholder
                  isBirthdaySet={isBirthdaySet} // use placeholder styles
                  onBirthdayButtonPressed={this.onBirthdayButtonPressed}
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
        <Modal
          visible={showDateModalIOS}
          title={'Your Birth Date'}
          bodyStyle={styles.dateModalBody}
          onCancel={this.onDateModalIOSCancel}
          onConfirm={this.onDateModalIOSConfirm}
          onRequestClose={this.onDateModalIOSCancel}
        >
          <DatePickerIOS
            date={birthday}
            mode="date"
            minimumDate={MINIMUM_DATE}
            maximumDate={MAXIMUM_DATE}
            onDateChange={(date) => {
              this.setState({ birthday: date, isBirthdaySet: true });
            }}
          />
        </Modal>
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
  const { signingIn, loadFBuser, fbuser } = auth;
  return { signingUp, signingIn, signupError, loadFBuser, fbuser };
};

export default connect(mapStateToProps, { loginUser, createUser })(AuthScreen);
