import React, { useContext, useState } from 'react';

import InvariantViolated from '@/errors/InvariantViolated';
import {
  Session,
  clear as _clearSession,
  load as _loadSession,
  save as _saveSession,
} from '@/utils/session';

export type SessionContextType = {
  session: Session;
  setSession: (newSession: Session) => void;
  clearSession: () => void;
};

// Null only occurs before the component is loaded (it should never occur)
export const SessionContext = React.createContext<SessionContextType | null>(
  null
);

export function SessionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, _setSession] = useState<Session>(_loadSession());

  const setSession = (newSession: Session) => {
    _setSession(newSession);
    _saveSession(newSession);
  };
  const clearSession = () => {
    _setSession({ loggedIn: false });
    _clearSession();
  };

  // Legacy global variable
  globalSessionContext = {
    session,
    setSession,
    clearSession,
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
}

export const useSession = function () {
  const context = useContext(SessionContext);
  if (!context) throw new InvariantViolated('Session context missing');
  return context.session;
};

/**
 * This global session variable allows legacy code to access the session without using hooks.
 *
 * @deprecated Use the `useSession` hook instead.
 */
export let globalSessionContext: SessionContextType;

/**
 * Get the current session, without using hooks. For new code, use hooks.
 *
 * @deprecated Use the `useSession` hook instead.
 */
export const legacy_getSession = function () {
  return globalSessionContext.session;
};

/**
 * Set the current session, without using hooks. For new code, use hooks.
 * @param newSession The new session object
 *
 * @deprecated Use the `useSession` hook instead.
 */
export const legacy_setSession = function (newSession: Session) {
  return globalSessionContext.setSession(newSession);
};

/**
 * Clear the current session, without using hooks. For new code, use hooks.
 *
 * @deprecated Use the `useSession` hook instead.
 */
export const legacy_clearSession = function () {
  return globalSessionContext.clearSession();
};
