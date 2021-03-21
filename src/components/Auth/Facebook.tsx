import React from 'react';
import { View, ActivityIndicator, ViewStyle, Text } from 'react-native';
import * as Facebook from 'expo-facebook';
import { FontAwesome } from '@expo/vector-icons';

import usePromise from 'app/hooks/usePromise';
import { SocialAuthResponse } from './SocialAuthResponse';
import InvariantViolation from 'app/errors/InvariantViolation';
import LoginCancelled from 'app/errors/LoginCancelled';
import Button from 'app/components/Button';
import { fbBlue, white } from 'app/constants/colors';
import * as Log from 'app/utils/log';
import connectAssertionLogin from './connectAssertionLogin';

function FacebookAuthButton({
  style = {},
  onPress = () => {},
  onSuccess,
  onFailure,
  pending = false,
}: {
  style?: ViewStyle;
  onPress: () => void;
  onSuccess: (response: SocialAuthResponse) => {};
  onFailure: (error: any) => {};
  pending?: boolean;
}) {
  const { state, error } = usePromise(
    () => Facebook.initializeAsync({ appId: '325314560922421' }),
    []
  );

  if (state === 'pending' || pending) {
    return (
      <View
        style={{
          ...style,
          marginVertical: 4,
          marginHorizontal: 16,
          backgroundColor: fbBlue,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          height: 47,
        }}>
        <ActivityIndicator />
      </View>
    );
  } else if (state === 'fulfilled') {
    return (
      <Button
        kind="facebookBlue"
        style={style}
        onPress={async () => {
          try {
            onPress();

            const result = await Facebook.logInWithReadPermissionsAsync({
              permissions: ['public_profile', 'email'],
            });

            if (result.type !== 'success') throw new LoginCancelled();
            if (!result.token) throw new InvariantViolation('Missing token');

            const {
              email,
              name,
            }: { email: string; name: string } = await fetch(
              `https://graph.facebook.com/me?access_token=${result.token}&fields=email,name`
            ).then((res) => res.json());

            onSuccess({
              service: 'facebook',
              token: result.token,
              email: email,
              suggestedUsername: name,
            });
          } catch (e) {
            onFailure(e);
          }
        }}
        bare={true}>
        <FontAwesome
          name="facebook-official"
          size={16}
          color={white}
          style={{ marginRight: 6 }}
        />
        <Text style={{ color: white, fontSize: 17, fontWeight: '600' }}>
          Sign up with Facebook
        </Text>
      </Button>
    );
  } else {
    Log.error(error);
    onFailure(error);
    return null;
  }
}

export default connectAssertionLogin(FacebookAuthButton, 'facebook');
