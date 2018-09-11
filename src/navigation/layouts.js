import { homeIcon, searchIcon, updateIcon, notificationIcon, libraryIcon } from 'kitsu/assets/img/tabbar_icons';
import * as Screens from './types';

export const MAIN = {
  root: {
    bottomTabs: {
      children: [
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
      ],
    },
  },
};
