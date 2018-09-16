import { homeIcon, searchIcon, updateIcon, notificationIcon, libraryIcon } from 'kitsu/assets/img/tabbar_icons';
import * as Screens from 'kitsu/navigation/types';

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

export const MAIN = (initialTab = 'Feed') => {
  // Tabs that user can select to start app on
  const tabs = {
    Feed: 0,
    Search: 1,
    QuickUpdate: 2,
    Library: 4,
  };
  const currentTabIndex = tabs[initialTab] || 0;

  return {
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
            options: {
              bottomTabs: {
                currentTabIndex,
              },
            },
          },
        },
      },
    },
  };
};
