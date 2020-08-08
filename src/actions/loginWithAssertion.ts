import { addSeconds } from 'date-fns';

import { Session } from 'app/types/session';
import { LoginFailed, NetworkError } from 'app/errors';

export default async function loginWithAssertion(
  { token, provider }: { token: string; provider: 'apple' | 'facebook' },
  init: RequestInit = {}
): Promise<NonNullable<Session>> {
  const params = new URLSearchParams({
    grant_type: 'assertion',
    assertion: token,
    provider,
  });
  const response = await fetch('https://kitsu.io/api/oauth/token', {
    method: 'POST',
    body: params,
    ...init,
  }).catch((e) => {
    throw new NetworkError(e.message);
  });
  const body = await response.json();

  if (response.status === 200) {
    return {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      loggedIn: true,
      expiresAt: addSeconds(new Date(), body.expires_in),
    };
  } else {
    switch (body.error) {
      case 'invalid_grant':
        throw new LoginFailed(body.error_description);
      default:
        throw new Error(body.error_description);
    }
  }
}
