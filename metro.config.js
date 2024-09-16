// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  minifierConfig: {
    drop_console: true,
  },
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('kitsu/') || moduleName.startsWith('@/')) {
    const resolved = resolve(moduleName.replace(/^(kitsu|@)\//i, './src/'));
    return context.resolveRequest(context, resolved, platform);
  }

  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
