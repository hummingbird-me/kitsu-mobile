import OAuth2 from 'client-oauth2';
import JsonApi from 'devour-client';
import { kitsuConfig } from './env';

export const auth = new OAuth2({
  clientId: kitsuConfig.authConfig.CLIENT_ID,
  clientSecret: kitsuConfig.authConfig.CLIENT_SECRET,
  accessTokenUri: `${kitsuConfig.baseUrl}/oauth/token`,
});

export const Kitsu = new JsonApi({
  apiUrl: `${kitsuConfig.baseUrl}/edge`,
  logger: false,
});

Kitsu.headers['User-Agent'] = `KitsuMobile/${kitsuConfig.version} (askar)`;

const errorMiddleware = {
  name: 'error-middleware',
  error: (payload) => {
    if (payload.status === 401) {
      return {
        request: {
          authorized: false,
        },
      };
    }
    const data = payload.data;
    if (!data.errors) {
      console.log('Unidentified error');
      console.log(payload);
      return null;
    }
    return payload.data.errors;
  },
};
Kitsu.replaceMiddleware('errors', errorMiddleware);

Kitsu.define(
  'users',
  {
    name: '',
    email: '',
    password: '',
    gender: '',
    facebookId: '',
  },
  { collectionPath: 'users' },
);

Kitsu.define(
  'anime',
  {
    slug: '',
    synopsis: '',
    titles: '',
    posterImage: '',
    startDate: '',
    endDate: '',
  },
  { collectionPath: 'anime' },
);
Kitsu.define(
  'user',
  {
    name: '',
    email: '',
    avatar: '',
    about: '',
    bio: '',
    createdAt: '',
  },
  { collectionPath: 'user' },
);

export const setToken = (token) => {
  Kitsu.headers.Authorization = `Bearer ${token}`;
};
