module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
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
};
