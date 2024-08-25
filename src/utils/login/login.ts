import { addSeconds } from 'date-fns';

import { apiPrefix, clientId } from '@/config/kitsu';
import NetworkError from '@/errors/NetworkError';
import BaseError from '@/errors/base';

import { Session } from '../session';

export class LoginFailed extends BaseError {
  readonly name = 'LoginFailed';
}

export default async function login({
  params = {},
  init,
}: {
  params?: Record<string, string>;
  init?: RequestInit;
}): Promise<NonNullable<Session>> {
  const body = new URLSearchParams(params);
  body.set('client_id', clientId);
  const response = await fetch(`${apiPrefix}/oauth/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
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
