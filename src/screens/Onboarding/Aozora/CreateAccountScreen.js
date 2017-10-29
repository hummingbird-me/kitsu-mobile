import React from 'react';
import { View, Text, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { Input } from 'kitsu/components/Input';
import { styles as commonStyles } from '../common/styles';

class CreateAccountScreen extends React.Component {
  state = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    usernameConfirmed: false,
  };

  onChangeText = (text, type) => {
    this.setState({ [type]: text });
  };

  onConfirm = () => {
    const { usernameConfirmed } = this.state;
    if (usernameConfirmed) {
      this.props.navigation.navigate('FavoritesScreen');
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
    const passwordSet = password.length >= 8 && password === confirmPassword;
    const buttonText =
      !usernameConfirmed || passwordSet ? 'Looks good!' : 'You need to set a password!';
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
        {usernameConfirmed ? (
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

export default CreateAccountScreen;
