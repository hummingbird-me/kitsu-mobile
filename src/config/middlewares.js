import { logoutUser, refreshTokens } from 'kitsu/store/auth/actions';
import store from 'kitsu/store/config';
import { isNull } from 'lodash';
import { setToken } from 'kitsu/config/api';

const helper = {
  tokenPromise: null,
};

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

export const kitsuRequestMiddleware = {
  name: 'kitsu-request-middleware',
  req: async (payload) => {
    const jsonApi = payload.jsonApi;

    // Send the request
    try {
      return await jsonApi.axios(payload.req);
    } catch (error) {
      // Check if we got an 401 or 403 error
      // If so then refresh our tokens
      if ([401, 403].includes(error.status)) {
        console.log(`Recieved a ${error.status}`);

        // Check if there's already a promise for refreshing tokens
        // If we don't then create the refresh token and set the promise
        if (isNull(helper.tokenPromise)) {
          helper.tokenPromise = store.dispatch(refreshTokens(true));
        }

        try {
          // wait for the token to refresh
          const tokens = await helper.tokenPromise;
          console.log('Refreshed tokens: ', tokens);

          const request = payload.req;

          // Re-set the token
          if (tokens && tokens.access_token) {
            console.log('Old headers: ', request.headers);
            setToken(tokens.access_token);
            request.headers.Authorization = `Bearer ${tokens.access_token}`;
            console.log('New headers: ', request.headers);
          }

          // And then resend the thing
          return await jsonApi.axios(request);
        } catch (e) {
          // Token refreshing failed! Abort!
          console.log('Failed to refresh tokens: ', e);
          store.dispatch(logoutUser());
          throw e;
        } finally {
          helper.tokenPromise = null;
        }
      }
      // Throw the error back
      throw error;
    }
  },
};
