module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'formatjs',
        { idInterpolationPattern: '[sha512:contenthash:base64:6]', ast: true },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
