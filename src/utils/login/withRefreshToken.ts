import { type LoggedInSession } from '../session';
import login from './login';

export default async function loginWithRefreshToken(
  refreshToken: string,
  init: RequestInit = {}
): Promise<LoggedInSession> {
  return login({
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    init,
  });
}
