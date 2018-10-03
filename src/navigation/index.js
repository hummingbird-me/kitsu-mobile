import { listBackPurple, tabRed, tabInactive } from 'kitsu/constants/colors';
import * as Screens from './types';
import * as Layouts from './layouts';
import { registerScreens } from './screens';
import * as NavigationActions from './actions';


// Default styling options
// https://wix.github.io/react-native-navigation/v2/#/docs/styling
// https://github.com/wix/react-native-navigation/issues/3694
export const defaultOptions = {
  sideMenu: {
    left: {
      // Disable side drawer for everything except feed
      enabled: false,
    },
  },
  layout: {
    backgroundColor: listBackPurple,
  },
  topBar: {
    // By Default we set the bar to not visible
    // This is because there are many components where we use a custom navigation bar
    visible: false,
    background: {
      color: listBackPurple,
    },
    backButton: { // android
      color: 'white',
    },
    buttonColor: 'white', // iOS
    title: {
      color: 'white',
    },
  },
  bottomTabs: {
    backgroundColor: listBackPurple,
    titleDisplayMode: 'alwaysHide',
  },
  bottomTab: {
    iconColor: tabInactive,
    textColor: tabInactive,
    selectedTextColor: tabRed,
    selectedIconColor: tabRed,
    badgeColor: tabRed,
    iconInsets: { // This is for iOS
      top: 6,
      bottom: -6,
      right: 0,
    },
  },
};

export { Screens, registerScreens, Layouts, NavigationActions };
