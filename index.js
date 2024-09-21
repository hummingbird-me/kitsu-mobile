// Load this first to record the start time of the app
// prettier-ignore
import { mark } from '@/utils/performance';

import * as Sentry from '@sentry/react-native';
import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

import App from '@/App';

if (__DEV__) {
  // Ignore common development-only warnings
  LogBox.ignoreLogs([
    'Could not find Fiber with id',
    'AppleAuthenticationButton',
  ]);
}

mark('Kitsu.App.Loaded');

registerRootComponent(App);
