import React from 'react';
import { View, Text, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { Input } from 'kitsu/components/Input';
import { connect } from 'react-redux';
import { updateGeneralSettings } from 'kitsu/store/user/actions';
import { setScreenName } from 'kitsu/store/onboarding/actions';
import isEmpty from 'lodash/isEmpty';
import { styles as commonStyles } from '../common/styles';

class CreateAccountScreen extends React.Component {
  state = {
    email: this.props.currentUser.email,
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

        // Update the values if we need
        if (!isEmpty(valuesToUpdate)) {
          await this.props.updateGeneralSettings(valuesToUpdate);
        }

        this.setState({ password: '', confirmPassword: '', shouldShowValidationInput: false });
        this.props.setScreenName('FavoritesScreen');
        navigation.navigate('FavoritesScreen');
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
    const { currentUser } = this.props;
    const isValidPass = password.length >= 8 && password === confirmPassword;
    const passwordSet = currentUser.hasPassword || isValidPass;

    const passwordText = passwordSet ? 'Looks good!' : 'You need to set a password!';
    const buttonText = !usernameConfirmed ? 'Confirm Username' : passwordText;

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
          disabled={!passwordSet && usernameConfirmed}
          style={{ marginTop: 36 }}
          onPress={this.onConfirm}
          title={buttonText}
          titleStyle={commonStyles.buttonTitleStyle}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ onboarding, user }) => {
  const { conflicts: accounts } = onboarding;
  const { loading, error, currentUser } = user;
  return { loading, error, currentUser, accounts };
};
export default connect(mapStateToProps, { updateGeneralSettings, setScreenName })(
  CreateAccountScreen,
);
