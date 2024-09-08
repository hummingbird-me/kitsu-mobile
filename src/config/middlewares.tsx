import * as Sentry from '@sentry/react-native';
import { isArray } from 'lodash';

import {
  legacy_clearSession,
  legacy_getSession,
  legacy_refreshSession,
} from '@/contexts/SessionContext';
import InvariantViolated from '@/errors/InvariantViolated';
import store from '@/store/config';
import { getComputedTitle } from '@/utils/getTitleField';

export const errorMiddleware = {
  name: 'error-middleware',
  error: (payload) => {
    const data = payload.data;
    if (!data?.errors) {
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
    const request = payload.req;

    const session = legacy_getSession();

    // Add auth to kitsu requests when logged in
    if (request.url.includes('kitsu.io') && session.loggedIn) {
      request.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    // Send the request
    try {
      return await jsonApi.axios(request);
    } catch (error) {
      // Check if we got a 401 error
      // If so then refresh our tokens
      if (parseInt(error.status, 10) === 401) {
        console.log(`Recieved a ${error.status}`);

        try {
          // wait for the token to refresh
          const tokens = await legacy_refreshSession();
          console.log('Refreshed tokens: ', tokens);

          if (tokens.loggedIn === false) {
            throw new InvariantViolated('Refreshed a logged out session');
          }

          // Re-set the token
          request.headers.Authorization = `Bearer ${tokens.accessToken}`;

          // And then resend the thing
          return await jsonApi.axios(request);
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

          legacy_clearSession();
          throw e;
        }
      }
      // Throw the error back
      throw error;
    }
  },
};

function applyTitle(item, currentUser) {
  if (!item || !currentUser) {
    return;
  }

  // The objects we want to apply title preferences to
  const whitelist = ['anime', 'manga', 'episodes'];

  if (whitelist.includes(item.type) && item.canonicalTitle) {
    item.canonicalTitle = getComputedTitle(currentUser, item);
  }
  if (item.anime) {
    applyTitle(item.anime, currentUser);
  }
  if (item.manga) {
    applyTitle(item.manga, currentUser);
  }
  if (item.media) {
    applyTitle(item.media, currentUser);
  }
}

export const titleMiddleware = {
  name: 'title-middleware',
  res: (payload) => {
    const currentUser = store.getState().user.currentUser;
    if (isArray(payload)) {
      payload.forEach((item) => applyTitle(item, currentUser));
    } else {
      applyTitle(payload, currentUser);
    }
    return payload;
  },
};
