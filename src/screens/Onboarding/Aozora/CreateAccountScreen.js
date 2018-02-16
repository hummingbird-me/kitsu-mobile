import React from 'react';
import { View, Text, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { Input } from 'kitsu/components/Input';
import { connect } from 'react-redux';
import { updateGeneralSettings } from 'kitsu/store/user/actions';
import { setScreenName } from 'kitsu/store/onboarding/actions';
import { isEmpty, isNull } from 'lodash';
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
      const { currentUser, navigation } = this.props;
      const isValidPass = !isEmpty(password) && password === confirmPassword;

      const valuesToUpdate = {
        ...((username !== currentUser.name && { name: username.trim() }) || {}),
        ...((email !== currentUser.email && { email: email.trim() }) || {}),
        ...((!currentUser.hasPassword && isValidPass && { password }) || {}),
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
          this.setState({ password: '', confirmPassword: '', shouldShowValidationInput: false });
          this.props.setScreenName('FavoritesScreen');
          navigation.navigate('FavoritesScreen');
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
    const { email, username, password, confirmPassword, usernameConfirmed } = this.state;
    const { currentUser, error, loading } = this.props;
    const isValidPass = password.length >= 8 && password === confirmPassword;
    const passwordSet = currentUser.hasPassword || isValidPass;

    const isEmailValid = !isEmpty(email) && email.includes('@');
    const fieldsValid = isEmailValid && !isEmpty(username);

    const passwordText = passwordSet ? 'Looks good!' : 'You need to set a password!';
    const usernameText = !usernameConfirmed ? 'Confirm Username' : passwordText;
    const buttonText = !fieldsValid ? 'Please fill out the fields above' : usernameText;

    return (
      <View style={commonStyles.container}>
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
          onChangeText={text => this.onChangeText(text, 'email')}
        />
        <Input
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={text => this.onChangeText(text, 'username')}
        />
        {usernameConfirmed && !currentUser.hasPassword ? (
          <View>
            <Input
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={text => this.onChangeText(text, 'password')}
            />
            <Input
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={text => this.onChangeText(text, 'confirmPassword')}
              autoCapitalize="none"
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
        { !isEmpty(error) &&
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              An Error Occurred: {error.detail || 'Something went wrong!'}
            </Text>
          </View>
        }
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
export default connect(mapStateToProps, { updateGeneralSettings, setScreenName })(
  CreateAccountScreen,
);
