import { type LoggedInSession } from '../session';
import login, { LoginFailed } from './login';

export default async function loginWithPassword(
  { username, password }: { username?: string; password?: string },
  init: RequestInit = {}
): Promise<LoggedInSession> {
  if (!username || !password) throw LoginFailed;

  return login({
    params: {
      grant_type: 'password',
      username,
      password,
    },
    init,
  });
}
