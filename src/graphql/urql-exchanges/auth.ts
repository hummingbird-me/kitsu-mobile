import { authExchange } from '@urql/exchange-auth';
import { Exchange, Operation } from 'urql';

import { refreshTokens } from 'kitsu/store/auth/actions';
import store from 'kitsu/store/config';

/*
 * @HACK: This is a messy way to grab the access token from the store and add it to our Urql
 * requests, and automatically call the refresh token endpoint if the access token is expired. In
 * the long run, this really should be switched to a Context like on the frontend, but for now we
 * can use this to enable GraphQL requests.
 */
export default function kitsuAuthExchange(): Exchange {
  return authExchange(async utils => ({
    addAuthToOperation(operation) {
      const accessToken = store.getState().auth.tokens.access_token;

      if (!accessToken) return operation;

      return utils.appendHeaders(operation, {
        Authorization: `Bearer ${accessToken}`,
      });
    },
    didAuthError(errors) {
      return errors.response.status === 401;
    },
    async refreshAuth() {
      const accessToken = store.getState().auth.tokens.access_token;

      if (!accessToken) return;

      await store.dispatch(refreshTokens());
    },
  }));
}
