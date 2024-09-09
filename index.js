import * as Sentry from '@sentry/react-native';
import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

import App from '@/App';

LogBox.ignoreLogs(['Could not find Fiber with id']);

// Only enable sentry on production builds
if (!__DEV__) {
  Sentry.init({
    dsn: 'https://068b9ab849bf4485beb4884adcc5be83:8c57373b9bb4410f99ebfd17878c739a@sentry.io/200469',
  });
}

registerRootComponent(App);
