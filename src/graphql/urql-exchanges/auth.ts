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

function addAuthToOperation({ operation }: { operation: Operation }) {
  const accessToken = store.getState().auth.tokens.access_token;

  if (!accessToken) return operation;

  // fetchOptions can be a function (See Client API) but you can simplify this based on usage
  const fetchOptions =
    typeof operation.context.fetchOptions === 'function'
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return {
    ...operation,
    context: {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    },
  };
}

export default function kitsuAuthExchange(): Exchange {
  return authExchange({
    addAuthToOperation,
    didAuthError({ error }) {
      return error.response.status === 401;
    },
    async getAuth() {
      const accessToken = store.getState().auth.tokens.access_token;

      if (!accessToken) return null;

      try {
        await store.dispatch(refreshTokens());
        return store.getState().auth.tokens.access_token;
      } catch (e) {
        return null;
      }
    },
  });
}
