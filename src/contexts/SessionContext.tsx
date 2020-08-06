import React, { useState, useContext } from 'react';

export type Session = {
  loggedIn: true;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
} | null;

export const SessionContext = React.createContext<{
  session: Session;
  setSession: React.Dispatch<React.SetStateAction<Session>>;
}>({
  session: null,
  setSession: () => {},
});

export const SessionContextProvider: React.FunctionComponent<{}> = function ({
  children,
}) {
  const [session, setSession] = useState<Session>(null);

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
      }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = function () {
  const { session } = useContext(SessionContext);
  return session;
};
