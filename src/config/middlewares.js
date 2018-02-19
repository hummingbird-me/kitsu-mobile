import { logoutUser, refreshTokens } from 'kitsu/store/auth/actions';
import store from 'kitsu/store/config';

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
    // return jsonApi.axios(payload.req);
    // Send the request
    return jsonApi.axios(payload.req).catch((error) => {
      // Check if we got an 401 or 403 error
      // If so then refresh our tokens
      if ([401, 403].includes(error.status)) {
        console.log(`Recieved a ${error.status}`);
        console.log('Refreshing tokens');
        // If we successfully refreshed the tokens then re-send the request, Otherwise logout
        return store.dispatch(refreshTokens(true)).then((tokens) => {
          console.log('Refreshed tokens: ', tokens);
          return jsonApi.axios(payload.req);
        }).catch((e) => {
          console.log('Failed to refresh tokens: ', e);
          if (store) store.dispatch(logoutUser());
          return Promise.reject(e);
        });
      }
      // Throw the error back
      return Promise.reject(error);
    });
  },
};
