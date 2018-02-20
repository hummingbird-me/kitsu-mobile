import { logoutUser, refreshTokens } from 'kitsu/store/auth/actions';
import store from 'kitsu/store/config';
import { isNull } from 'lodash';

const helper = {
  tokenPromise: null,
};

export const errorMiddleware = {
  name: 'error-middleware',
  error: (payload) => {
    console.log('failed payload', payload);
    if (payload.status === 401 || payload.status === 403) {
      return {
        request: {
          authorized: false,
        },
      };
    }
    const data = payload.data;
    if (!(data && data.errors)) {
      console.log('Unidentified error');
      console.log(payload);
      return null;
    }
    return payload.data.errors;
  },
};

export const kitsuRequestMiddleware = {
  name: 'kitsu-request-middleware',
  req: (payload) => {
    const jsonApi = payload.jsonApi;

    // Send the request
    return jsonApi.axios(payload.req).catch((error) => {
      // Check if we got an 401 or 403 error
      // If so then refresh our tokens
      if ([401, 403].includes(error.status)) {
        console.log(`Recieved a ${error.status}.`);
        console.log('Refreshing tokens.');

        // Check if there's already a promise for refreshing tokens
        let promise = helper.tokenPromise;

        // If we don't then create the refresh token and set the token
        if (isNull(promise)) {
          promise = store.dispatch(refreshTokens(true));
          helper.tokenPromise = promise;
        }

        // If we successfully refreshed the tokens then re-send the request, Otherwise logout
        return promise.then((tokens) => {
          console.log('Refreshed tokens: ', tokens);
          helper.tokenPromise = null;
          return jsonApi.axios(payload.req);
        }).catch((e) => {
          console.log('Failed to refresh tokens: ', e);
          helper.tokenPromise = null;
          if (store) store.dispatch(logoutUser());
          return Promise.reject(e);
        });
      }
      // Throw the error back
      return Promise.reject(error);
    });
  },
};
