import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import store from 'kitsu/store/config';

import QuickUpdateScreen from 'kitsu/screens/QuickUpdateScreen';
import NotificationsScreen from 'kitsu/screens/Notifications/NotificationsScreen';
import * as Screens from './types';
import { feedRoutes, sidebarRoutes, searchRoutes, libraryRoutes, pageRoutes } from './routes';

const routes = {
  ...feedRoutes,
  [Screens.QUICK_UPDATE]: QuickUpdateScreen,
  [Screens.NOTIFICATION]: NotificationsScreen,
  ...libraryRoutes,
  ...sidebarRoutes,
  ...searchRoutes,
  ...pageRoutes,
};

export function registerScreens() {
  Object.keys(routes).forEach((key) => {
    registerComponent(key, () => routes[key]);
  });
}

function registerComponent(name, callback) {
  Navigation.registerComponentWithRedux(name, callback, Provider, store);
}
