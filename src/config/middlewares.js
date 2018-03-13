import { logoutUser, refreshTokens } from 'kitsu/store/auth/actions';
import store from 'kitsu/store/config';
import { isNull, isEmpty } from 'lodash';
import { Sentry } from 'react-native-sentry';

let tokenPromise = null;

export const errorMiddleware = {
  name: 'error-middleware',
  error: (payload) => {
    const data = payload.data;
    if (!(data && data.errors)) {
      console.log('Unidentified error');
      console.log(payload);
      return payload;
    }
    return payload.data.errors;
  },
};

function setTokens(tokens, request) {
  if (isEmpty(tokens) || isEmpty(tokens.access_token)) return;
  request.headers.Authorization = `Bearer ${tokens.access_token}`;
}

export const kitsuRequestMiddleware = {
  name: 'kitsu-request-middleware',
  req: async (payload) => {
    const jsonApi = payload.jsonApi;
    const request = payload.req;
    const currentTokens = store.getState().auth.tokens;

    // Add auth to kitsu requests
    if (request.url && request.url.includes('kitsu.io')) {
      setTokens(currentTokens, request);
    }

    // Send the request
    try {
      return await jsonApi.axios(request);
    } catch (error) {
      // Check if we got a 401 error
      // If so then refresh our tokens
      if (parseInt(error.status, 10) === 401) {
        console.log(`Recieved a ${error.status}`);

        // Check if there's already a promise for refreshing tokens
        // If we don't then create the refresh token and set the promise
        if (isNull(tokenPromise)) {
          tokenPromise = store.dispatch(refreshTokens(true));

          // Log to sentry
          Sentry.captureMessage('Recieved a 401', {
            tags: {
              type: 'refresh_token',
            },
            extra: {
              isTokenEmpty: !currentTokens || isEmpty(currentTokens.access_token),
              originalError: error,
              request,
              headers: request.headers,
            },
          });
        }

        try {
          // wait for the token to refresh
          const tokens = await tokenPromise;
          console.log('Refreshed tokens: ', tokens);

          const newRequest = request;

          // Re-set the token
          setTokens(tokens, newRequest);

          // And then resend the thing
          return await jsonApi.axios(newRequest);
        } catch (e) {
          // Token refreshing failed! Abort!
          console.log('Failed to refresh tokens: ', e);

          // Log to sentry
          Sentry.captureMessage('Failed to refresh token', {
            tags: {
              type: 'refresh_token',
            },
            extra: {
              exception: e,
              originalError: error,
              request,
              headers: request.headers,
            },
          });

          store.dispatch(logoutUser());
          throw e;
        } finally {
          tokenPromise = null;
        }
      }
      // Throw the error back
      throw error;
    }
  },
};
