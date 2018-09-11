import { Navigation } from 'react-native-navigation';
import { Sentry } from 'react-native-sentry';
import { registerScreens, Layouts, defaultOptions } from 'kitsu/navigation';

Sentry.config('https://068b9ab849bf4485beb4884adcc5be83:8c57373b9bb4410f99ebfd17878c739a@sentry.io/200469');

// Only enable sentry on production builds
if (!__DEV__) {
  Sentry.install();
}

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions(defaultOptions);

  Navigation.setRoot(Layouts.MAIN);
});

