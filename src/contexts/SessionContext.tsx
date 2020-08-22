import React, { useState, useContext } from 'react';

import { Session } from 'app/types/session';
import * as SessionStore from 'app/utils/session-store';

export const SessionContext = React.createContext<{
  session: Session;
  setSession: (newSession: Session) => Promise<void>;
  clearSession: () => Promise<void>;
}>({
  session: null,
  setSession: async () => {},
  clearSession: async () => {},
});

export const SessionContextProvider: React.FunctionComponent<{}> = function ({
  children,
}) {
  const [session, _setSession] = useState<Session>(null);

  const setSession = (newSession: Session) => {
    _setSession(newSession);
    return SessionStore.save(newSession);
  };
  const clearSession = () => {
    _setSession(null);
    return SessionStore.clear();
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        clearSession,
      }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = function () {
  const { session } = useContext(SessionContext);
  return session;
};
