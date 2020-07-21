import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';

import ScrollingPosters from './ScrollingPosters';
import Button from 'app/components/button';
import { white } from 'app/constants/colors';

export default function RegistrationScreen() {
  return (
    <View style={{ flexDirection: 'column' }}>
      <ScrollingPosters />
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={{ height: 47, marginRight: 16, marginLeft: 16, marginBottom: 4 }}
        onPress={async () => {}}
      />
      <Button
        kind="facebookBlue"
        onPress={() => console.log('Facebook')}
        bare={true}>
        <FontAwesome
          name="facebook-official"
          size={20}
          color={white}
          style={{ marginRight: 6 }}
        />
        <Text style={{ color: white, fontSize: 17, fontWeight: '600' }}>
          Sign up with Facebook
        </Text>
      </Button>
      <Button kind="outline" onPress={() => console.log('Sin')} bare>
        <Text style={{ color: white, fontSize: 17, fontWeight: '600' }}>
          Create an Account
        </Text>
      </Button>
      <Text>Already have an account?</Text>
    </View>
  );
}
