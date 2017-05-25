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


Kitsu.define(
  'users',
  {
    name: '',
    createdAt: '',
    updatedAt: '',
    email: '',
    avatar: '',
    gender: '',
    birthday: '',
  },
  { collectionPath: 'users' },
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
