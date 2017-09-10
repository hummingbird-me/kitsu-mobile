import React from 'react';
import { View, Image } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { LoginManager } from 'react-native-fbsdk';
import * as colors from 'kitsu/constants/colors';
import { OnboardingHeader } from './common/';
import styles from './styles';

const TEMP_IMG_URL = 'https://goo.gl/7XKV53';

const GalleryRow = () => (
  <View style={{ marginVertical: 8, flexDirection: 'row', justifyContent: 'center' }}>
    <Image source={{ uri: TEMP_IMG_URL }} style={styles.squareImage} />
    <Image source={{ uri: TEMP_IMG_URL }} style={styles.squareImage} />
    <Image source={{ uri: TEMP_IMG_URL }} style={styles.squareImage} />
    <Image source={{ uri: TEMP_IMG_URL }} style={styles.squareImage} />
  </View>
);

export default class RegistrationScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
  };

  onSucess = () => {
    // TODO: implement this function.
  }

  loginFacebook = () => {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      (result) => {
        if (!result.isCancelled) {
          this.onSuccess();
        }
      },
      (error) => {
        console.log(`Login fail with error: ${error}`);
      },
    );
  };

  render() {
    const { navigate } = this.props.navigation;
    // TODO: make this screen responsive.
    return (
      <View style={styles.container}>
        <OnboardingHeader style={styles.header} />
        <View style={{ flex: 8 }}>
          <View>
            <GalleryRow />
            <GalleryRow />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button
              style={{ backgroundColor: colors.fbBlueDark }}
              title={'Sign up with Facebook'}
              icon={'facebook-official'}
              onPress={this.loginFacebook}
            />
            <Button
              style={{
                backgroundColor: colors.transparent,
                borderWidth: 1.5,
                borderColor: colors.darkGrey,
              }}
              title={'Create an Account'}
              onPress={() => navigate('Signup')}
            />
            <Button
              style={{ backgroundColor: colors.transparent }}
              title={'Already have an account?'}
              titleStyle={{ fontSize: 12, color: colors.lightGrey }}
              onPress={() => navigate('Login')}
            />
          </View>
        </View>
      </View>
    );
  }
}
