import React from 'react';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import App from 'kitsu/App';
import ApplicationContext from 'kitsu/contexts';
import * as Screens from 'kitsu/navigation/types';
import { LightBox } from 'kitsu/screens/LightBox';
import QuickUpdateScreen from 'kitsu/screens/QuickUpdateScreen';
import store from 'kitsu/store/config';
import { withActivityIndicatorHOC } from 'kitsu/utils/deeplink';
import { withNotifications } from 'kitsu/utils/notifications';

import authRoutes from './auth';
import feedRoutes from './feed';
import libraryRoutes from './library';
import notificationRoutes from './notification';
import onboardingRoutes from './onboarding';
import pageRoutes from './pages';
import searchRoutes from './search';
import sidebarRoutes from './sidebar';

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

function registerComponent(name: string, callback) {
  const Component = callback();
  Navigation.registerComponent(
    name,
    () => (props) => {
      return (
        <Provider store={store}>
          <ApplicationContext>
            <Component {...props} />
          </ApplicationContext>
        </Provider>
      );
    },
    () => <Component />
  );
}

/**
 * Register the screens for React Native Navigation
 */
export function registerScreens() {
  Object.keys(routes).forEach((key) => {
    registerComponent(key, () => {
      return withNotifications(withActivityIndicatorHOC(routes[key]));
    });
  });
}
