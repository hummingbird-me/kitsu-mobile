import { useContext } from 'react';

import usePromise from 'app/hooks/usePromise';
import { SessionContext } from 'app/contexts/SessionContext';
import * as SessionStore from 'app/utils/session-store';

export default function loadSession() {
  let { setSession } = useContext(SessionContext);
  let { state, value } = usePromise(
    () =>
      SessionStore.load().then((value) => {
        if (value) setSession(value);
        return value;
      }),
    []
  );

  if (state === 'fulfilled') {
    console.log('SESSION', value);
    return true;
  } else {
    return false;
  }
}
