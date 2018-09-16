import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import store from 'kitsu/store/config';

import App from 'kitsu/App';
import QuickUpdateScreen from 'kitsu/screens/QuickUpdateScreen';
import NotificationsScreen from 'kitsu/screens/Notifications/NotificationsScreen';
import { LightBox } from 'kitsu/screens/LightBox';
import * as Screens from './types';
import { feedRoutes, sidebarRoutes, searchRoutes, libraryRoutes, pageRoutes, authRoutes, onboardingRoutes } from './routes';

const routes = {
  ...feedRoutes,
  ...libraryRoutes,
  ...sidebarRoutes,
  ...searchRoutes,
  ...pageRoutes,
  ...authRoutes,
  ...onboardingRoutes,
  [Screens.QUICK_UPDATE]: QuickUpdateScreen,
  [Screens.NOTIFICATION]: NotificationsScreen,
  [Screens.LIGHTBOX]: LightBox,
  [Screens.INITIAL]: App,
};

export function registerScreens() {
  Object.keys(routes).forEach((key) => {
    registerComponent(key, () => routes[key]);
  });
}

function registerComponent(name, callback) {
  Navigation.registerComponentWithRedux(name, callback, Provider, store);
}
