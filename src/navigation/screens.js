import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import store from 'kitsu/store/config';

import App from 'kitsu/App';
import { withNotifications } from 'kitsu/utils/notifications';
import QuickUpdateScreen from 'kitsu/screens/QuickUpdateScreen';
import { LightBox } from 'kitsu/screens/LightBox';
import * as Screens from './types';
import { feedRoutes, sidebarRoutes, searchRoutes, libraryRoutes, pageRoutes, authRoutes, onboardingRoutes, notificationRoutes } from './routes';

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

export function registerScreens() {
  Object.keys(routes).forEach((key) => {
    registerComponent(key, () => withNotifications(routes[key]));
  });
}

function registerComponent(name, callback) {
  Navigation.registerComponentWithRedux(name, callback, Provider, store);
}
