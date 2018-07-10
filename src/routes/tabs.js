/* eslint react/no-multi-comp:0 */

import React, { PureComponent, Component } from 'react';
import { DrawerNavigator, TabNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { fetchAlgoliaKeys } from 'kitsu/store/app/actions';
import { fetchNotifications } from 'kitsu/store/feed/actions';
import { tabRed, listBackPurple } from 'kitsu/constants/colors';
import { SidebarScreen } from 'kitsu/screens/Sidebar';
import { isNull } from 'lodash';

import SearchStack from './search';
import NotificationsStack from './notification';
import QuickUpdateStack from './quickUpdate';
import FeedStack from './feed';
import LibraryStack from './library';

const TOP_LEVEL_ROUTES = [
  'FeedActivity',
  'SearchAll',
  'QuickUpdate',
  'Notifications',
  'LibraryScreen',
  'DrawerToggle',
  'DrawerOpen',
];

const getRouteName = (state) => {
  if (!state) return null;
  const route = state.routes[state.index];
  if (route.routes) {
    return getRouteName(route);
  }
  return route.routeName;
};

const Tabs = (initialRouteName = 'Feed') => (
  TabNavigator(
    {
      Feed: {
        screen: FeedStack,
      },
      Search: {
        screen: SearchStack,
      },
      QuickUpdate: {
        screen: QuickUpdateStack,
      },
      Notifications: {
        screen: NotificationsStack,
      },
      Library: {
        screen: LibraryStack,
      },
    },
    {
      initialRouteName,
      lazy: true,
      removeClippedSubviews: true,
      tabBarPosition: 'bottom',
      swipeEnabled: false,
      tabBarOptions: {
        activeTintColor: tabRed,
        inactiveBackgroundColor: listBackPurple,
        activeBackgroundColor: listBackPurple,
        showLabel: false,
        showIcon: true,
        iconStyle: {
          width: 44,
          height: 44,
        },
        style: {
          height: 44.96,
          borderTopWidth: 0,
          backgroundColor: listBackPurple,
        },
        tabStyle: {
          height: 44.96,
          borderTopWidth: 0,
        },
        indicatorStyle: {
          backgroundColor: tabRed,
        },
        backgroundColor: listBackPurple,
      },
      navigationOptions: ({ navigation }) => {
        const route = getRouteName(navigation.state);

        // By default have the drawer be openable
        let drawerLockMode = 'unlocked';
        if (route && !TOP_LEVEL_ROUTES.includes(route)) {
          drawerLockMode = 'locked-closed';
        }
        return {
          drawerLockMode,
        };
      },
    },
  )
);

const Drawer = initialRouteName => (
  DrawerNavigator({
    Tabs: {
      screen: Tabs(initialRouteName),
    },
  }, {
    contentComponent: SidebarScreen, // Use our own component
    drawerBackgroundColor: listBackPurple,
  })
);

/*
This is a really wacky hack job to show a specific tab at the start of the app.
There is no other easy way to navigate to a specific Tab using `NavigationActions.reset`.

We have to have a wrapper for the `Drawer` otherwise `TabsNav` keeps re-rendering it,
causing it to mess up some nav actions, specifically navigation from the drawer.
*/
class DrawerWrapper extends PureComponent {
  static propTypes = {
    initialPage: PropTypes.string,
  }

  static defaultProps = {
    initialPage: null,
  }

  Wrapper = null;

  render() {
    const { initialPage, ...otherProps } = this.props;

    // Create the drawer if we haven't
    if (!this.Wrapper) {
      this.Wrapper = Drawer(initialPage);
    }

    return (
      <this.Wrapper
        {...otherProps}
      />
    );
  }
}

class TabsNav extends PureComponent {
  static propTypes = {
    badge: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchCurrentUser: PropTypes.func.isRequired,
    fetchAlgoliaKeys: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
    initialPage: PropTypes.string,
  };

  static defaultProps = {
    initialPage: null,
  };

  componentWillMount() {
    this.fetchCurrentUser();

    // We also fetch keys here because tokens might have been null during app start
    this.props.fetchAlgoliaKeys();
  }

  fetchCurrentUser = async () => {
    try {
      await this.props.fetchCurrentUser();
      this.props.fetchNotifications();
    } catch (e) {
      console.warn(e);
    }
  };

  render() {
    const { navigation: rootNavigation, badge, initialPage } = this.props;
    const props = { rootNavigation, badge };
    return (
      <DrawerWrapper
        initialPage={initialPage}
        screenProps={props}
      />
    );
  }
}

const mapper = ({ feed, app }) => ({
  badge: feed.notificationsUnseen,
  initialPage: app.initialPage,
});

export default connect(mapper, { fetchCurrentUser, fetchAlgoliaKeys, fetchNotifications })(TabsNav);
