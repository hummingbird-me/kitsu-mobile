import { Navigation } from 'react-native-navigation';
import { setDeepLinkTabIndex } from 'kitsu/utils/deeplink';
import * as Screens from './types';
import * as Layouts from './layouts';


/**
 * Show the application intro/auth screen
 */
export function showIntro() {
  Navigation.setRoot(Layouts.INTRO);
}


/**
 * Show the main application screen.
 * Tabs that you can select are: Feed, Search, QuickUpdate or Library.
 *
 * @param {string} [initialTab='Feed'] The initial tab to show.
 */
export async function showMainApp(initialTab = 'Feed') {
  // Tabs that user can select to start app on
  const tabs = {
    Feed: 0,
    Search: 1,
    QuickUpdate: 2,
    Library: 4,
  };
  const currentTabIndex = tabs[initialTab] || 0;

  // Set the initial tab index for deep link
  setDeepLinkTabIndex(currentTabIndex);
  
  Navigation.setRoot(Layouts.MAIN);
  Navigation.mergeOptions(Screens.BOTTOM_TABS, {
    bottomTabs: {
      currentTabIndex,
    },
  });
}


/**
 * Show the onboarding screen
 */
export function showOnboarding() {
  Navigation.setRoot(Layouts.ONBOARDING);
}


/**
 * Show the modal to create post.
 *
 * @param {*} props Props to pass to the screen
 */
export function showCreatePostModal(props) {
  Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: Screens.FEED_CREATE_POST,
          passProps: props,
        },
      }],
    },
  });
}

/**
 * Show the image lightbox.
 *
 * @param {[string]} images An array of string urls.
 * @param {number} [initialImageIndex=0] the index of the initial image to show.
 */
export function showLightBox(images, initialImageIndex = 0) {
  Navigation.showOverlay({
    component: {
      name: Screens.LIGHTBOX,
      passProps: { images, initialImageIndex },
    },
  });
}
