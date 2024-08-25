import { ConfigContext, ExpoConfig } from 'expo/config';

const isDebug = process.env.EXPO_ENV === 'release' ? false : true;

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'Kitsu',
  slug: 'kitsu',
  version: '4.0',
  githubUrl: 'https://github.com/hummingbird-me/kitsu-mobile',
  orientation: 'portrait',
  backgroundColor: '#433342',
  primaryColor: '#FD755C',
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
      foregroundImage: './src/assets/icons/launcher/adaptive-foreground.png',
      monochromeImage: './src/assets/icons/launcher/adaptive-foreground.png',
      backgroundColor: '#433342',
    },
  },
  androidStatusBar: {
    barStyle: 'light-content',
  },
  notification: {
    icon: './src/assets/icons/launcher/adaptive-foreground.png',
    color: '#FD755C',
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
  ],
});
