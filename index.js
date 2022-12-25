import * as Sentry from '@sentry/react-native';
import { LogBox } from 'react-native';
import { Navigation } from 'react-native-navigation';
import OneSignal from 'react-native-onesignal';

import { Layouts, defaultOptions, registerScreens } from 'kitsu/navigation';

LogBox.ignoreLogs(['Could not find Fiber with id']);

window.btoa = require('base-64').encode;
window.atob = require('base-64').decode;

// Only enable sentry on production builds
if (!__DEV__) {
  Sentry.init({
    dsn: 'https://068b9ab849bf4485beb4884adcc5be83:8c57373b9bb4410f99ebfd17878c739a@sentry.io/200469',
  });
}

// Set notification display
OneSignal.inFocusDisplaying(2);

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions(defaultOptions);
  Navigation.setRoot(Layouts.INITIAL);
});
