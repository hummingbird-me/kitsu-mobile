import { AppRegistry } from 'react-native';
import { Sentry } from 'react-native-sentry';
import App from './src/App';

Sentry.config('https://068b9ab849bf4485beb4884adcc5be83:8c57373b9bb4410f99ebfd17878c739a@sentry.io/200469');

// Only enable sentry on production builds
if (!__DEV__) {
  Sentry.install();
}

AppRegistry.registerComponent('kitsu_mobile', () => App);
