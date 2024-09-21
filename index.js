// Load this first to record the start time of the app
// prettier-ignore
import { mark } from '@/utils/performance';

import * as Sentry from '@sentry/react-native';
import { registerRootComponent } from 'expo';
import { setBackgroundColorAsync, setPositionAsync } from 'expo-navigation-bar';
import { setStatusBarTranslucent } from 'expo-status-bar';
import { warmUpAsync } from 'expo-web-browser';
import { LogBox, Platform } from 'react-native';

import App from '@/App';

// Warm up the browser on Android
if (Platform.OS === 'android') {
  warmUpAsync();
  setPositionAsync('absolute');
  setBackgroundColorAsync('#00000000');
  setStatusBarTranslucent(true);
}

if (__DEV__) {
  // Ignore common development-only warnings
  LogBox.ignoreLogs([
    'Could not find Fiber with id',
    'AppleAuthenticationButton',
  ]);
}

// Only enable sentry on production builds
if (!__DEV__) {
  Sentry.init({
    dsn: 'https://068b9ab849bf4485beb4884adcc5be83:8c57373b9bb4410f99ebfd17878c739a@sentry.io/200469',
  });
}
mark('Kitsu.App.Loaded');

registerRootComponent(App);
