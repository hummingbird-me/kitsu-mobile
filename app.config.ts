import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Kitsu',
  slug: 'Kitsu',
  platforms: ['ios', 'android', 'web'],
  version: '1.0.0',
  orientation: 'portrait',
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  icon: './src/assets/icon.png',
  splash: {
    backgroundColor: '#402F3F',
  },
  androidNavigationBar: {
    barStyle: 'light-content',
    backgroundColor: '#402F3F',
  },
  ios: {
    supportsTablet: false,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/icon-fg.png',
      backgroundColor: '#402F3F',
    },
  },
  extra: {
    apiHost: 'https://kitsu.io/',
  },
});
