module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'formatjs',
        { idInterpolationPattern: '[sha512:contenthash:base64:6]', ast: true },
      ],
      [
        'babel-plugin-inline-import',
        {
          extensions: ['.glsl'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
    env: {
      production: {
        plugins: ['transform-remove-console'],
      },
    },
  };
};
