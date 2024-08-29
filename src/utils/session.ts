import * as SecureStore from 'expo-secure-store';

import InvariantViolated from '@/errors/InvariantViolated';

const SESSION_KEY = 'kitsu-session';

export type LoggedInSession = {
  loggedIn: true;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};
export type LoggedOutSession = {
  loggedIn: false;
};
export type Session = LoggedInSession | LoggedOutSession;

/**
 * Load the session from storage
 * @returns The session object
 */
export function load(): Session {
  try {
    const serialized = SecureStore.getItem(SESSION_KEY);
    return serialized ? JSON.parse(serialized) : { loggedIn: false };
  } catch (cause) {
    console.error(
      new InvariantViolated('Error while parsing session', { cause })
    );
    return { loggedIn: false };
  }
}

/**
 * Save the session to storage
 * @param session The session object
 */
export function save(session: Session) {
  const serialized = JSON.stringify(session);
  SecureStore.setItem(SESSION_KEY, serialized);
}

/**
 * Clear the session from storage
 */
export function clear() {
  SecureStore.deleteItemAsync(SESSION_KEY).catch((cause) => {
    // @TODO: Replace this with Sentry
    console.error(new InvariantViolated('Failed to clear session'), { cause });
  });
}
