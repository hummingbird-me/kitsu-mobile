import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Kitsu',
  slug: 'Kitsu',
  platforms: ['ios', 'android', 'web'],
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  splash: {
    backgroundColor: '#402F3F',
  },
  androidNavigationBar: {
    barStyle: 'light-content',
    backgroundColor: '#402F3F',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
  },
  extra: {
    apiHost: 'https://kitsu.io/',
  },
});
