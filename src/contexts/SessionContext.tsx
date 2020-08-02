import React, { useState, useContext } from 'react';

export type Session = {
  loggedIn: true;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
} | null;

const Context = React.createContext<{
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
    <Context.Provider
      value={{
        session,
        setSession,
      }}>
      {children}
    </Context.Provider>
  );
};

export const useSession = function () {
  const { session } = useContext(Context);
  return session;
};
