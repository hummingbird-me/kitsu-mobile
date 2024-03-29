import { isEmpty, isNull } from 'lodash';
import React from 'react';
import { LayoutAnimation, Platform, Text, UIManager, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import { Button } from 'kitsu/components/Button';
import { Input } from 'kitsu/components/Input';
import { PasswordInput } from 'kitsu/components/PasswordInput';
import { Screens } from 'kitsu/navigation';
import { OnboardingHeader } from 'kitsu/screens/Onboarding';
import { setScreenName } from 'kitsu/store/onboarding/actions';
import { updateGeneralSettings } from 'kitsu/store/user/actions';

import { styles as commonStyles } from '../common/styles';
import { styles } from './styles';

class CreateAccountScreen extends React.Component {
  state = {
    email: this.props.currentUser.email || this.props.fbuser.email || '',
    username: this.props.currentUser.name,
    password: '',
    confirmPassword: '',
    usernameConfirmed: false,
  };

  onChangeText = (text, type) => {
    this.setState({ [type]: text.trim() });
  };

  onConfirm = async () => {
    const { usernameConfirmed } = this.state;
    if (usernameConfirmed) {
      const { username, email, password, confirmPassword } = this.state;
      const { currentUser, componentId } = this.props;
      const isValidPass =
        !isEmpty(password) && password.trim() === confirmPassword.trim();

      const valuesToUpdate = {
        ...((username !== currentUser.name && { name: username.trim() }) || {}),
        ...((email !== currentUser.email && { email: email.trim() }) || {}),
        ...((!currentUser.hasPassword &&
          isValidPass && { password: password.trim() }) ||
          {}),
      };
      console.log('values to update', valuesToUpdate);

      // Only continue if user has set the name and email
      if (!isEmpty(username) && !isEmpty(email)) {
        let error = null;

        // Update the values if we need
        if (!isEmpty(valuesToUpdate)) {
          error = await this.props.updateGeneralSettings(valuesToUpdate);
        }

        // Only continue if we don't have an error
        if (isNull(error)) {
          this.setState({
            password: '',
            confirmPassword: '',
            shouldShowValidationInput: false,
          });
          this.props.setScreenName('FavoritesScreen');
          Navigation.setStackRoot(componentId, {
            component: { name: Screens.ONBOARDING_FAVORITES_SCREEN },
          });
        }
      }
    } else {
      if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ usernameConfirmed: true });
    }
  };

  render() {
    const { email, username, password, confirmPassword, usernameConfirmed } =
      this.state;
    const { currentUser, error, loading } = this.props;
    const isValidPass =
      password.trim().length >= 8 && password.trim() === confirmPassword.trim();
    const passwordSet = currentUser.hasPassword || isValidPass;

    const isEmailValid = !isEmpty(email) && email.includes('@');
    const fieldsValid = isEmailValid && !isEmpty(username);

    const passwordText = passwordSet
      ? 'Looks good!'
      : 'Password needs to be atleast 8 characters long';
    const usernameText = !usernameConfirmed ? 'Confirm Username' : passwordText;
    const buttonText = !fieldsValid
      ? 'Please fill out the fields above'
      : usernameText;

    // We need to extract the error contents
    // We can't be sure if it's a kitsu error object or just a string
    // Thus we check both below
    let errorString = null;
    if (!isEmpty(error)) {
      if (error instanceof Array && error[0]) {
        errorString =
          error[0].detail || error[0].title || 'Something went wrong';
      } else if (error instanceof String) {
        errorString = error;
      } else {
        errorString = error.detail || error.title || 'Something went wrong';
      }
    }

    return (
      <View style={commonStyles.container}>
        <OnboardingHeader />
        <View style={{ flex: 1 }}>
          <Text style={commonStyles.tutorialText}>
            Great, almost done!{'\n'}
            Confirm or edit your account details.
          </Text>
          <Input
            containerStyle={{ marginTop: 24 }}
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            keyboardType={'email-address'}
            onChangeText={(text) => this.onChangeText(text, 'email')}
          />
          <Input
            placeholder="Username"
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={(text) => this.onChangeText(text, 'username')}
          />
          {usernameConfirmed && !currentUser.hasPassword ? (
            <View>
              <PasswordInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => this.onChangeText(text, 'password')}
              />
              <PasswordInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) =>
                  this.onChangeText(text, 'confirmPassword')
                }
              />
            </View>
          ) : (
            <View />
          )}
          <Button
            disabled={!fieldsValid || (!passwordSet && usernameConfirmed)}
            style={{ marginTop: 36 }}
            onPress={this.onConfirm}
            title={buttonText}
            titleStyle={commonStyles.buttonTitleStyle}
            loading={loading}
          />
          {!isEmpty(errorString) && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                An Error Occurred: {errorString}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ onboarding, user, auth }) => {
  const { conflicts: accounts } = onboarding;
  const { loading, generalSettingError: error, currentUser } = user;
  const { fbuser } = auth;
  return { loading, error, currentUser, accounts, fbuser };
};
export default connect(mapStateToProps, {
  updateGeneralSettings,
  setScreenName,
})(CreateAccountScreen);
