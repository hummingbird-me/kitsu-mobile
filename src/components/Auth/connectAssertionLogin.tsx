import React, { useState, useContext } from 'react';

import loginWithAssertion from 'app/actions/loginWithAssertion';
import {
  SocialAuthProviderName,
  SocialAuthResponse,
} from './SocialAuthResponse';
import { SessionContext } from 'app/contexts/SessionContext';

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

    return (
      <WrappedComponent
        pending={pending}
        onPress={() => setPending(true)}
        onSuccess={async ({ token }) => {
          const session = await loginWithAssertion({ token, provider });
          setSession(session);
          console.log(session);
          // TODO: navigate to app screen
          setPending(false);
        }}
        onFailure={(error) => {
          setPending(false);
          // TODO: display a Toast
        }}
      />
    );
  };
}
