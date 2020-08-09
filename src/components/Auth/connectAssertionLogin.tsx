import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

import loginWithAssertion from 'app/actions/loginWithAssertion';
import {
  SocialAuthProviderName,
  SocialAuthResponse,
} from './SocialAuthResponse';
import { SessionContext } from 'app/contexts/SessionContext';
import * as SessionStore from 'app/utils/session-store';

/**
 * Wraps the auth components which provide
 * @param  {[type]} WrappedComponent [description]
 * @return {[type]}                  [description]
 */
export default function connectAssertionLogin(
  WrappedComponent: React.ComponentType<{
    pending: boolean;
    onPress: () => void;
    onSuccess: (auth: SocialAuthResponse) => void;
    onFailure: (error: any) => void;
  }>,
  provider: SocialAuthProviderName
) {
  return () => {
    const [pending, setPending] = useState(false);
    const { setSession } = useContext(SessionContext);
    const navigation = useNavigation();

    return (
      <WrappedComponent
        pending={pending}
        onPress={() => setPending(true)}
        onSuccess={async ({ token }) => {
          const session = await loginWithAssertion({ token, provider });
          await SessionStore.save(session);
          setSession(session);
          // TODO: navigate to app screen
          setPending(false);
          navigation.navigate('ProfileDrawer');
        }}
        onFailure={(error) => {
          setPending(false);
          // TODO: display a Toast
        }}
      />
    );
  };
}
