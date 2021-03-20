const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'import-graphql',
      [
        'module-resolver',
        {
          extensions: [
            '.js',
            '.ts',
            '.ios.js',
            '.ios.ts',
            '.android.js',
            '.android.ts',
            '.json',
          ],
          alias: {
            app: path.resolve(__dirname, 'src'),
          },
        },
      ],
    ],
  };
};
