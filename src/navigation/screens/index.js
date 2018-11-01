import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import store from 'kitsu/store/config';

import App from 'kitsu/App';
import { withNotifications } from 'kitsu/utils/notifications';
import { withActivityIndicatorHOC } from 'kitsu/utils/deeplink';
import QuickUpdateScreen from 'kitsu/screens/QuickUpdateScreen';
import { LightBox } from 'kitsu/screens/LightBox';

import * as Screens from 'kitsu/navigation/types';

import sidebarRoutes from './sidebar';
import searchRoutes from './search';
import feedRoutes from './feed';
import libraryRoutes from './library';
import pageRoutes from './pages';
import authRoutes from './auth';
import onboardingRoutes from './onboarding';
import notificationRoutes from './notification';

const routes = {
  ...feedRoutes,
  ...libraryRoutes,
  ...sidebarRoutes,
  ...searchRoutes,
  ...pageRoutes,
  ...authRoutes,
  ...onboardingRoutes,
  ...notificationRoutes,
  [Screens.QUICK_UPDATE]: QuickUpdateScreen,
  [Screens.LIGHTBOX]: LightBox,
  [Screens.INITIAL]: App,
};


function registerComponent(name, callback) {
  Navigation.registerComponentWithRedux(name, callback, Provider, store);
}

/**
 * Register the screens for React Native Navigation
 */
export function registerScreens() {
  Object.keys(routes).forEach((key) => {
    registerComponent(key, () => withNotifications(withActivityIndicatorHOC(routes[key])));
  });
}
