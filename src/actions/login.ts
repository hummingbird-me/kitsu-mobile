import { addSeconds } from 'date-fns';
import Constants from 'expo-constants';

import { Session } from 'app/types/session';
import { LoginFailed, NetworkError } from 'app/errors';

export default async function login({
  params = {},
  init,
}: {
  params?: {};
  init?: RequestInit;
}): Promise<NonNullable<Session>> {
  const host = Constants.manifest.extra.kitsu.host;
  const body = new URLSearchParams(params);
  const response = await fetch(`${host}api/oauth/token`, {
    method: 'POST',
    body,
    ...init,
  }).catch((e) => {
    throw new NetworkError(e.message);
  });
  const json = await response.json();

  if (response.status === 200) {
    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      loggedIn: true,
      expiresAt: addSeconds(new Date(), json.expires_in),
    };
  } else {
    switch (json.error) {
      case 'invalid_grant':
        throw new LoginFailed(json.error_description);
      default:
        throw new Error(json.error_description);
    }
  }
}
