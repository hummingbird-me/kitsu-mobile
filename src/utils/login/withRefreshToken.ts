import { Session } from '../session';
import login from './login';

export default async function loginWithRefreshToken(
  refreshToken: string,
  init: RequestInit = {}
): Promise<NonNullable<Session>> {
  return login({
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    init,
  });
}
