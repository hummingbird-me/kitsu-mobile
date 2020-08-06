import React from 'react';
import { View, ActivityIndicator, ViewStyle } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { getRandomBytesAsync } from 'expo-random';

import usePromise from 'app/hooks/usePromise';
import { SocialAuthResponse } from './SocialAuthResponse';
import LoginCancelled from 'app/errors/LoginCancelled';
import InvariantViolation from 'app/errors/InvariantViolation';
import * as Log from 'app/utils/log';

export default function AppleAuthButton({
  style = {},
  onPress = () => {},
  onSuccess,
  onFailure,
  pending = false,
}: {
  style?: ViewStyle;
  onPress?: () => void;
  onSuccess: (response: SocialAuthResponse) => {};
  onFailure: (error: any) => {};
  pending: boolean;
}) {
  const { state, value, error } = usePromise(
    () => AppleAuthentication.isAvailableAsync(),
    []
  );

  if (state === 'pending' || pending) {
    return (
      <View
        style={{
          ...style,
          backgroundColor: 'black',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator />
      </View>
    );
  } else if (state === 'fulfilled' && value) {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={style}
        onPress={async () => {
          try {
            onPress();

            const stateBytes = await getRandomBytesAsync(32);
            const decoder = new TextDecoder('utf8');
            const state = btoa(decoder.decode(stateBytes));

            const {
              email,
              fullName,
              identityToken,
              state: postState,
            } = await AppleAuthentication.signInAsync({
              state,
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            if (!identityToken) throw new InvariantViolation('Missing token');
            if (postState !== state)
              throw new InvariantViolation('State mismatch');

            onSuccess({
              service: 'apple',
              token: identityToken,
              email: email || undefined,
              suggestedUsername:
                fullName?.nickname || fullName?.givenName
                  ? `${fullName?.givenName} ${fullName?.familyName}`
                  : undefined,
            });
          } catch (e) {
            if (e.code === 'ERR_CANCELED') {
              onFailure(new LoginCancelled());
            } else {
              onFailure(e);
            }
          }
        }}
      />
    );
  } else if (state === 'fulfilled' && !value) {
    return null;
  } else {
    onFailure(error);
    Log.error(error);
    return null;
  }
}
