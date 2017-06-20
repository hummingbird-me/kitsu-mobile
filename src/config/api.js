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
  pluralize: false,
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
    if (!(data && data.errors)) {
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
    avatar: '',
    about: '',
    bio: '',
    createdAt: '',
    website: '',
    birthday: '',
    aboutFormatted: '',
    location: '',
    waifuOrHusbando: '',
    followersCount: '',
    facebookId: '',
    followingCount: '',
    lifeSpentOnAnime: '',
    gender: '',
    updatedAt: '',
    commentsCount: '',
    favoritesCount: '',
    likesGivenCount: '',
    reviewsCount: '',
    likesReceivedCount: '',
    postsCount: '',
    ratingsCount: '',
    proExpiresAt: '',
    title: '',
    profileCompleted: '',
    feedCompleted: '',
    coverImage: '',
    ratingSystem: '',
    theme: '',
    pastNames: '',
    timeZone: '',
    country: '',
    sfwFilter: '',
    titleLanguagePreference: '',
    shareToGlobal: '',
    language: '',
    previousEmail: '',
    confirmed: '',
    password: '',
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
    website: '',
    birthday: '',
    aboutFormatted: '',
    location: '',
    waifuOrHusbando: '',
    followersCount: '',
    facebookId: '',
    followingCount: '',
    lifeSpentOnAnime: '',
    gender: '',
    updatedAt: '',
    commentsCount: '',
    favoritesCount: '',
    likesGivenCount: '',
    reviewsCount: '',
    likesReceivedCount: '',
    postsCount: '',
    ratingsCount: '',
    proExpiresAt: '',
    title: '',
    profileCompleted: '',
    feedCompleted: '',
    coverImage: '',
    ratingSystem: '',
    theme: '',
    pastNames: '',
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
    coverImageTopOffset: '',
    canonicalTitle: '',
    abbreviatedTitles: '',
    averageRating: '',
    ratingFrequencies: '',
  },
  { collectionPath: 'anime' },
);

Kitsu.define(
  'manga',
  {
    slug: '',
    synopsis: '',
    titles: '',
    posterImage: '',
    startDate: '',
    endDate: '',
    coverImageTopOffset: '',
    canonicalTitle: '',
    abbreviatedTitles: '',
    averageRating: '',
    ratingFrequencies: '',
  },
  { collectionPath: 'manga' },
);

Kitsu.define(
  'categories',
  {
    title: '',
    nsfw: '',
    childCount: '',
    image: '',
    slug: '',
    description: '',
    totalMediaCount: '',
    parent: {
      jsonApi: 'hasMany',
    },
    anime: {
      jsonApi: 'hasMany',
    },
    drama: {
      jsonApi: 'hasMany',
    },
    manga: {
      jsonApi: 'hasMany',
    },
  },
  {
    collectionPath: 'categories',
  },
);

Kitsu.define(
  'activities',
  {
    status: '',
    streamId: '',
    foreignId: '',
    progress: '',
    replyToType: '',
    replyToUser: '',
    nineteenScale: '',
    mentionedUsers: '',
    verb: '',
    time: '',
    rating: '',
    actor: {
      jsonApi: 'hasMany',
    },
    user: {
      jsonApi: 'hasMany',
    },
    target: {
      jsonApi: 'hasMany',
    },
  },
  {
    collectionPath: 'feeds/notifications',
  },
);

Kitsu.define(
  'posts',
  {
    link: '',
    title: '',
    commentsCount: '',
    pastNames: '',
    content: '',
    contentFormatted: '',
    postLikesCount: '',
    spoiler: '',
    nsfw: '',
    blocked: '',
    deletedAt: '',
    createdAt: '',
    updatedAt: '',
    topLevelCommentsCount: '',
    editedAt: '',
    user: { jsonApi: 'hasMany', type: 'users' },
  },
  {
    collectionPath: 'posts',
  },
);

Kitsu.define(
  'activityGroups',
  {
    group: '',
    isSeen: '',
    activities: {
      jsonApi: 'hasMany',
    },
    isRead: '',
  },
  {
    collectionPath: 'feeds/notifications',
  },
);

Kitsu.define(
  'streamers',
  {
    siteName: '',
    logo: '',
    streamingLinks: '',
  },
  {
    collectionPath: 'streamers',
  },
);

export const setToken = (token) => {
  Kitsu.headers.Authorization = `Bearer ${token}`;
};
