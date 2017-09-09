import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <OnboardingHeader />
        <View style={{ marginVertical: 16, }}>
          <GalleryRow />
          <GalleryRow />
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.fbBlue,
            height: 47,
            marginHorizontal: 16,
            borderRadius: 4,
          }}
          disabled={false}
          onPress={() => {}}
        >
          <Icon
            size={20}
            name="facebook-official"
            style={{
              color: colors.white,
              paddingRight: 8,
              paddingLeft: 8,
            }}
          />
          <Text style={{
            fontFamily: 'OpenSans',
            fontSize: 15,
            lineHeight: 25,
            color: colors.white,
            textAlign: 'left',
          }}>
            Sign up with Facebook
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
