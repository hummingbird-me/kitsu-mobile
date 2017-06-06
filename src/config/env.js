export let kitsuConfig = {};

if (__DEV__) {
  kitsuConfig = {
    authConfig: {
      CLIENT_ID: 'dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd',
      CLIENT_SECRET: '54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151',
    },
    baseUrl: 'https://staging.kitsu.io/api',
    version: '0.0.1',
  };
} else {
  kitsuConfig = {
    authConfig: {
      CLIENT_ID: 'dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd',
      CLIENT_SECRET: '54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151',
    },
    baseUrl: 'https://kitsu.io/api',
    version: '0.0.0',
  };
}
