import 'ts-node/register';

import { ConfigContext, ExpoConfig } from 'expo/config';

import { blue, kitsuOrange, kitsuPurple } from './src/constants/palette';

const isDebug = process.env.EXPO_ENV === 'release' ? false : true;

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'Kitsu',
  slug: 'kitsu',
  version: '4.0',
  githubUrl: 'https://github.com/hummingbird-me/kitsu-mobile',
  orientation: 'portrait',
  backgroundColor: kitsuPurple[5],
  primaryColor: kitsuOrange,
  icon: `./src/assets/icons/launcher/${isDebug ? 'debug' : 'release'}.png`,
  extra: {
    eas: {
      projectId: '1d3b1dca-db2b-470d-80fd-47a5f2936195',
    },
  },
  ios: {
    bundleIdentifier: `app.kitsu.mobile${isDebug ? '.debug' : ''}`,
    usesAppleSignIn: true,
    associatedDomains: ['applinks:kitsu.io'],
  },
  android: {
    package: `app.kitsu.mobile${isDebug ? '.debug' : ''}`,
    intentFilters: [
      {
        autoVerify: true,
        action: 'VIEW',
        data: [
          {
            scheme: 'https',
            host: 'kitsu.app',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
    adaptiveIcon: {
      foregroundImage: `./src/assets/icons/launcher/${
        isDebug ? 'debug' : 'release'
      }-adaptive-foreground.png`,
      monochromeImage: `./src/assets/icons/launcher/${
        isDebug ? 'debug' : 'release'
      }-adaptive-foreground.png`,
      backgroundColor: isDebug ? blue[1] : kitsuPurple[5],
    },
  },
  androidStatusBar: {
    backgroundColor: kitsuPurple[5],
    barStyle: 'light-content',
  },
  androidNavigationBar: {
    backgroundColor: kitsuPurple[5],
    barStyle: 'light-content',
  },
  notification: {
    icon: `./src/assets/icons/launcher/${
      isDebug ? 'debug' : 'release'
    }-adaptive-foreground.png`,
    color: kitsuOrange,
  },
  plugins: [
    'expo-secure-store',
    'expo-localization',
    [
      'expo-font',
      {
        fonts: [
          'node_modules/@expo-google-fonts/asap/Asap_700Bold.ttf',
          'node_modules/@expo-google-fonts/open-sans/OpenSans_400Regular.ttf',
          'node_modules/@expo-google-fonts/open-sans/OpenSans_700Bold.ttf',
        ],
      },
    ],
    [
      'react-native-fbsdk-next',
      {
        appID: '325314560922421',
        clientToken: 'dbae1dbf77c13f3d6755a2a8cb116106',
        displayName: 'Kitsu',
        scheme: 'fb325314560922421',
        advertiserIDCollectionEnabled: false,
        autoLogAppEventsEnabled: false,
        isAutoInitEnabled: true,
      },
    ],
  ],
});
