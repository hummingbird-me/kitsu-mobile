import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
          onSuccess(true);
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
      <ScrollView style={styles.container}>
        <OnboardingHeader />
        <View style={{ marginVertical: 24, justifyContent: 'center', }}>
          <GalleryRow />
          <GalleryRow />
        </View>
        <View style={{ height: 200, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={this.loginFacebook}
            style={[styles.button, {
              backgroundColor: colors.fbBlueDark,
            }]}
            disabled={false}
          >
            <Icon
              size={20}
              name="facebook-official"
              style={styles.fbIcon}
            />
            <Text style={styles.buttonText}>
              Sign up with Facebook
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate('Signup')}
            style={[styles.button, {
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: colors.darkGrey,
            }]}
          >
            <Text style={styles.buttonText}>Create an Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate('Login')}
            style={[styles.button, {
              backgroundColor: 'transparent',
            }]}
          >
            <Text style={[styles.buttonText, {
              color: colors.lightGrey,
            }]}
            >
              Already have an account?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
