import { homeIcon, searchIcon, updateIcon, notificationIcon, libraryIcon } from 'app/assets/img/tabbar_icons';
import * as Screens from 'app/navigation/types';

const feed = {
  stack: {
    children: [
      {
        component: {
          id: Screens.FEED,
          name: Screens.FEED,
        },
      },
    ],
    options: {
      bottomTab: {
        icon: homeIcon,
      },
    },
  },
};

const search = {
  stack: {
    children: [
      {
        component: {
          id: Screens.SEARCH,
          name: Screens.SEARCH,
        },
      },
    ],
    options: {
      bottomTab: {
        icon: searchIcon,
      },
    },
  },
};

const quickUpdate = {
  stack: {
    children: [
      {
        component: {
          id: Screens.QUICK_UPDATE,
          name: Screens.QUICK_UPDATE,
        },
      },
    ],
    options: {
      bottomTab: {
        icon: updateIcon,
      },
    },
  },
};

const notification = {
  stack: {
    children: [
      {
        component: {
          id: Screens.NOTIFICATION,
          name: Screens.NOTIFICATION,
        },
      },
    ],
    options: {
      bottomTab: {
        icon: notificationIcon,
      },
    },
  },
};

const library = {
  stack: {
    children: [
      {
        component: {
          id: Screens.LIBRARY,
          name: Screens.LIBRARY,
        },
      },
    ],
    options: {
      bottomTab: {
        icon: libraryIcon,
      },
    },
  },
};

export const MAIN = {
  root: {
    sideMenu: {
      id: Screens.SIDEBAR,
      left: {
        component: {
          name: Screens.SIDEBAR,
        },
        enabled: false,
      },
      center: {
        bottomTabs: {
          id: Screens.BOTTOM_TABS,
          children: [
            feed,
            search,
            quickUpdate,
            notification,
            library,
          ],
        },
      },
    },
  },
};
