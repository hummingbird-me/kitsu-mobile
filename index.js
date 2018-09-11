import { Navigation } from 'react-native-navigation';
import { Sentry } from 'react-native-sentry';
import { registerScreens, Layouts, defaultOptions } from 'kitsu/navigation';

Sentry.config('https://068b9ab849bf4485beb4884adcc5be83:8c57373b9bb4410f99ebfd17878c739a@sentry.io/200469');

// Only enable sentry on production builds
if (!__DEV__) {
  Sentry.install();
}

console.disableYellowBox = true;

// If you're using the debugging tools for React Native, the network tab is normally useless
// because it shows network activity to load the JS bundle only. This line causes it to
// use the dev tools XMLHttpRequest object if dev tools is running, making the network
// tab useful again. If dev tools isn't running, this will have no effect.
// NOTE: Disable this if you intend to upload files
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions(defaultOptions);

  Navigation.setRoot(Layouts.MAIN);
});

