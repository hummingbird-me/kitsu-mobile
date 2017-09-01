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
    console.log('failed payload', payload);
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
    mediaReactionsCount: '',
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
    waifu: {
      jsonApi: 'hasOne',
      type: 'characters',
    },
    followers: {
      jsonApi: 'hasMany',
      type: 'follows',
    },
    following: {
      jsonApi: 'hasMany',
      type: 'follows',
    },
    libraryEntries: {
      jsonApi: 'hasMany',
      type: 'libraryEntries',
    },
    favorites: {
      jsonApi: 'hasMany',
    },
    pinnedPost: {
      jsonApi: 'hasMany',
    },
    blocks: {
      jsonApi: 'hasMany',
      type: 'blocks',
    },
    linkedAccounts: {
      jsonApi: 'hasMany',
      type: 'linkedAccounts',
    },
    profileLinks: {
      jsonApi: 'hasMany',
    },
    mediaFollows: {
      jsonApi: 'hasMany',
    },
    userRoles: {
      jsonApi: 'hasMany',
    },
    reviews: {
      jsonApi: 'hasMany',
    },
    stats: {
      jsonApi: 'hasMany',
    },
    notificationSettings: {
      jsonApi: 'hasMany',
    },
    oneSignalPlayers: {
      jsonApi: 'hasMany',
    },
  },
  { collectionPath: 'users' },
);

Kitsu.define(
  'libraryEntries',
  {
    createdAt: '',
    updatedAt: '',
    status: '',
    progress: '',
    volumesOwned: '',
    reactionSkipped: '',
    reconsuming: '',
    reconsumeCount: '',
    notes: '',
    private: '',
    progressedAt: '',
    startedAt: '',
    finishedAt: '',
    rating: '',
    ratingTwenty: '',
    user: {
      jsonApi: 'hasOne',
      type: 'users',
    },
    anime: {
      jsonApi: 'hasOne',
    },
    manga: {
      jsonApi: 'hasOne',
    },
    drama: {
      jsonApi: 'hasOne',
    },
    review: {
      jsonApi: 'hasMany',
    },
    mediaReaction: {
      jsonApi: 'hasMany',
    },
    media: {
      jsonApi: 'hasOne',
      type: ['anime', 'manga', 'drama'],
    },
    unit: {
      jsonApi: 'hasMany',
    },
    nextUnit: {
      jsonApi: 'hasMany',
    },
  },
  { collectionPath: 'library-entries' },
);

Kitsu.define(
  'characters',
  {
    name: '',
    slug: '',
    malId: '',
    description: '',
    image: '',
    createdAt: '',
    updatedAt: '',
    castings: {
      jsonApi: 'hasMany',
    },
    primaryMedia: {
      jsonApi: 'hasMany',
    },
  },
  { collectionPath: 'characters' },
);

Kitsu.define(
  'chapters',
  {
    id: '',
    createdAt: '',
    updatedAt: '',
    titles: '',
    canonicalTitle: '',
    volumeNumber: '',
    number: '',
    synopsis: '',
    published: '',
    length: '',
    thumbnail: '',
    manga: {
      jsonApi: 'hasOne',
    },
  },
  { collectionPath: 'chapters' },
);

Kitsu.define(
  'blocks',
  {
    createdAt: '',
    updatedAt: '',
    user: {
      jsonApi: 'hasOne',
      type: 'users',
    },
    blocked: {
      jsonApi: 'hasOne',
      type: 'users',
    },
  },
  { collectionPath: 'blocks' },
);

Kitsu.define(
  'linkedAccounts',
  {
    externalUserId: '',
    kind: '',
    syncTo: '',
    token: '',
    createdAt: '',
    updatedAt: '',
    shareTo: '',
    shareFrom: '',
    disabledReason: '',
    libraryEntryLogs: '',
    user: {
      jsonApi: 'hasOne',
      type: 'users',
    },
  },
  { collectionPath: 'linked-accounts' },
);

Kitsu.define(
  'libraryEntryLogs',
  {
    actionPerformed: '',
    createdAt: '',
    errorMessage: '',
    progress: '',
    rating: '',
    reconsumeCount: '',
    reconsuming: '',
    status: '',
    syncStatus: '',
    updatedAt: '',
    volumesOwned: '',
    media: {
      jsonApi: 'hasOne',
      type: ['anime', 'manga', 'drama'],
    },
  },
  { collectionPath: 'library-entry-logs' },
);

Kitsu.define(
  'castings',
  {
    createdAt: '',
    role: '',
    voiceActor: '',
    featured: '',
    language: '',
    media: {
      jsonApi: 'hasOne',
    },
    person: {
      jsonApi: 'hasOne',
    },
    updatedAt: '',
    character: {
      jsonApi: 'hasOne',
    },
  },
  { collectionPath: 'castings' },
);

Kitsu.define(
  'follows',
  {
    id: '',
    createdAt: '',
    updatedAt: '',
    follower: {
      jsonApi: 'hasOne',
      type: 'users',
    },
    followed: {
      jsonApi: 'hasOne',
      type: 'users',
    },
  },
  { collectionPath: 'follows' },
);

Kitsu.define(
  'listImports',
  {
    inputText: '',
    strategy: '',
    kind: '',
    inputFile: '',
    progress: '',
    status: '',
    total: '',
    errorMessage: '',
    errorTrace: '',
    createdAt: '',
    updatedAt: '',
    user: {
      jsonApi: 'hasOne',
      type: 'users',
    },
  },
  { collectionPath: 'list-imports' },
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
    createdAt: '',
    updatedAt: '',
    userCount: '',
    favoritesCount: '',
    popularityRank: '',
    ratingRank: '',
    ageRating: '',
    ageRatingGuide: '',
    subtype: '',
    status: '',
    coverImage: '',
    episodeCount: '',
    episodeLength: '',
    youtubeVideoId: '',
    showType: '',
    nsfw: '',
    tba: '',
    genres: {
      jsonApi: 'hasMany',
    },
    categories: {
      jsonApi: 'hasMany',
    },
    castings: {
      jsonApi: 'hasMany',
    },
    installments: {
      jsonApi: 'hasMany',
    },
    mappings: {
      jsonApi: 'hasMany',
    },
    reviews: {
      jsonApi: 'hasMany',
    },
    mediaRelationships: {
      jsonApi: 'hasMany',
    },
    episodes: {
      jsonApi: 'hasMany',
    },
    streamingLinks: {
      jsonApi: 'hasMany',
    },
    animeProductions: {
      jsonApi: 'hasMany',
    },
    animeCharacters: {
      jsonApi: 'hasMany',
    },
    animeStaff: {
      jsonApi: 'hasMany',
    },
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
    createdAt: '',
    updatedAt: '',
    userCount: '',
    favoritesCount: '',
    popularityRank: '',
    ratingRank: '',
    ageRating: '',
    ageRatingGuide: '',
    subtype: '',
    status: '',
    coverImage: '',
    chapterCount: '',
    volumeCount: '',
    serialization: '',
    mangaType: '',
    tba: '',
    genres: {
      jsonApi: 'hasMany',
    },
    categories: {
      jsonApi: 'hasMany',
    },
    castings: {
      jsonApi: 'hasMany',
    },
    installments: {
      jsonApi: 'hasMany',
    },
    mappings: {
      jsonApi: 'hasMany',
    },
    reviews: {
      jsonApi: 'hasMany',
    },
    mediaRelationships: {
      jsonApi: 'hasMany',
    },
    chapters: {
      jsonApi: 'hasMany',
    },
    mangaProductions: {
      jsonApi: 'hasMany',
    },
    mangaCharacters: {
      jsonApi: 'hasMany',
    },
    mangaStaff: {
      jsonApi: 'hasMany',
    },
  },
  { collectionPath: 'manga' },
);

Kitsu.define(
  'genres',
  {
    id: '',
    createdAt: '',
    updatedAt: '',
    name: '',
    slug: '',
    description: '',
  },
  { collectionPath: 'genres' },
);
Kitsu.define(
  'mediaRelationships',
  {
    id: '',
    createdAt: '',
    updatedAt: '',
    role: '',
    source: {
      jsonApi: 'hasMany',
    },
    destination: {
      jsonApi: 'hasOne',
    },
  },
  { collectionPath: 'mediaRelationships' },
);
Kitsu.define(
  'episodes',
  {
    canonicalTitle: '',
    seasonNumber: '',
    number: '',
    titles: '',
    updatedAt: '',
    synopsis: '',
    airdate: '',
    length: '',
    thumbnail: '',
    media: {
      jsonApi: 'hasOne',
    },
    createdAt: '',
  },
  { collectionPath: 'episodes' },
);

Kitsu.define(
  'reviews',
  {
    id: '',
    createdAt: '',
    updatedAt: '',
    content: '',
    contentFormatted: '',
    likesCount: '',
    progress: '',
    rating: '',
    source: '',
    spoiler: '',
    libraryEntry: {
      jsonApi: 'hasMany',
    },
    media: {
      jsonApi: 'hasMany',
    },
    user: {
      jsonApi: 'hasOne',
      type: 'users',
    },
  },
  { collectionPath: 'reviews' },
);

Kitsu.define(
  'mediaReactions',
  {
    id: '',
    reaction: '',
    upVotesCount: '',
    likesCount: '',
    content: '',
    contentFormatted: '',
    blocked: '',
    createdAt: '',
    updatedAt: '',
    editedAt: '',
    deletedAt: '',
    libraryEntry: {
      jsonApi: 'hasOne',
    },
    user: {
      jsonApi: 'hasOne',
    },
    anime: {
      jsonApi: 'hasOne',
    },
    manga: {
      jsonApi: 'hasOne',
    },
  },
  { collectionPath: 'media-reactions' },
);

Kitsu.define(
  'favorites',
  {
    createdAt: '',
    updatedAt: '',
    id: '',
    favRank: '',
    user: {
      jsonApi: 'hasMany',
    },
    item: {
      jsonApi: 'hasOne',
      type: ['anime', 'manga', 'characters'],
    },
  },
  { collectionPath: 'favorites' },
);

Kitsu.define(
  'categories',
  {
    title: '',
    createdAt: '',
    updatedAt: '',
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
  { collectionPath: 'categories' },
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
    createdAt: '',
    updatedAt: '',
    verb: '',
    time: '',
    rating: '',
    media: {
      jsonApi: 'hasOne',
    },
    actor: {
      jsonApi: 'hasOne',
    },
    user: {
      jsonApi: 'hasMany',
    },
    target: {
      jsonApi: 'hasMany',
    },
    subject: {
      jsonApi: 'hasOne',
    },
    unit: {
      jsonApi: 'hasMany',
    },
  },
  { collectionPath: 'feeds/notifications' },
);

Kitsu.define('comments', {}, { collectionPath: 'comments' });

Kitsu.define(
  'userFeed',
  {
    createdAt: '',
    updatedAt: '',
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
  { collectionPath: 'feeds/user_aggr' },
);

Kitsu.define(
  'mediaFeed',
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
    targetInterest: '',
    actor: {
      jsonApi: 'hasMany',
    },
    user: {
      jsonApi: 'hasMany',
    },
    target: {
      jsonApi: 'hasMany',
    },
    targetUser: {
      jsonApi: 'hasMany',
    },
    media: {
      jsonApi: 'hasOne',
    },
  },
  { collectionPath: 'feeds/media_aggr' },
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
    user: {
      jsonApi: 'hasMany',
      type: 'users',
    },
  },
  { collectionPath: 'posts' },
);

Kitsu.define(
  'postLikes',
  {
    id: '',
    createdAt: '',
    updatedAt: '',
    post: {
      jsonApi: 'hasOne',
    },
    user: {
      jsonApi: 'hasMany',
    },
  },
  { collectionPath: 'post-likes' },
);

Kitsu.define(
  'activityGroups',
  {
    group: '',
    isSeen: '',
    createdAt: '',
    updatedAt: '',
    activities: {
      jsonApi: 'hasMany',
    },
    isRead: '',
  },
  { collectionPath: 'feeds/notifications' },
);

Kitsu.define(
  'oneSignalPlayers',
  {
    playerId: '',
    platform: '',
    user: {
      jsonApi: 'hasOne',
    },
  },
  { collectionPath: 'one-signal-players' },
);

Kitsu.define(
  'streamers',
  {
    siteName: '',
    logo: '',
    streamingLinks: '',
  },
  { collectionPath: 'streamers' },
);

Kitsu.define(
  'groups',
  {
    slug: '',
    about: '',
    locale: '',
    membersCount: '',
    name: '',
    nsfw: '',
    privacy: '',
    rules: '',
    rulesFormatted: '',
    leadersCount: '',
    neighborsCount: '',
    featured: '',
    tagline: '',
    lastActivityAt: '',
    avatar: '',
    coverImage: '',
    createdAt: '',
    updatedAt: '',
    pinnedPost: {
      jsonApi: 'hasOne',
    },
    members: {
      jsonApi: 'hasMany',
    },
    neighbors: {
      jsonApi: 'hasMany',
    },
    tickets: {
      jsonApi: 'hasMany',
    },
    invites: {
      jsonApi: 'hasMany',
    },
    reports: {
      jsonApi: 'hasMany',
    },
    leaderChatMessages: {
      jsonApi: 'hasMany',
    },
    actionLogs: {
      jsonApi: 'hasMany',
    },
    category: {
      jsonApi: 'hasOne',
    },
  },
  { collectionPath: 'groups' },
);

Kitsu.define(
  'groupMembers',
  {
    rank: '',
    createdAt: '',
    unreadCount: '',
    updatedAt: '',
    hidden: '',
    permissions: {
      jsonApi: 'hasMany',
    },
    group: {
      jsonApi: 'hasOne',
    },
    user: {
      jsonApi: 'hasOne',
    },
    notes: {
      jsonApi: 'hasMany',
    },
  },
  { collectionPath: 'group-members' },
);

export const setToken = (token) => {
  Kitsu.headers.Authorization = `Bearer ${token}`;
};
