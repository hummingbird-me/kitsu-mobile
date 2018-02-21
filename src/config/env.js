const isProduction = true;
const kitsuUrl = isProduction ? 'https://kitsu.io' : 'https://staging.kitsu.io';

export const kitsuConfig = {
  isProduction,
  authConfig: {
    CLIENT_ID: 'dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd',
    CLIENT_SECRET: '54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151',
  },
  kitsuUrl,
  assetsUrl: `${kitsuUrl}/images`,
  baseUrl: `${kitsuUrl}/api`,
  version: '0.0.0',
  stream: {
    API_KEY: 'eb6dvmba4ct3',
    API_SECRET:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.fXxS0SjjkETZRNvKOnv69RBtfxOaLPcrRNOqLuMmnV4',
    APP_ID: '18373',
  },
  algoliaAppId: 'AWQO5J657S',
  cannyBoardTokens: {
    bugReport: 'b3f2fed5-ca07-bf13-dbbb-6e9fea351064',
    featureRequest: 'fed94acf-1df6-dda7-fdd0-7c86cb41eb63',
    databaseRequest: '91febb25-fc04-e80a-c5c4-0dcd7028a4ac',
  },
  giphy: {
    apiKey: 'l2YStwkAmzBNWuFxe',
    endpoint: 'https://api.giphy.com/v1/gifs/search?',
    trending: 'https://api.giphy.com/v1/gifs/trending?',
  },
  imgixBaseUrl: isProduction ? 'kitsu.imgix.net' : 'kitsu-staging.imgix.net',
};
