const path = require('path');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          kitsu: './src/',
        },
      },
    ],
    [
      'babel-plugin-inline-import',
      {
        extensions: ['.glsl'],
      },
    ],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
