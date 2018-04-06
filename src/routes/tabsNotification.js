/**
 * Looks like navigating from root router to a nested screen inside the tab
 * stack is not possible. Created a hacky TabNavigator with initial screen of
 * Notifications. This way user can navigate to related notification.
 *
 * Related issues: react-community/react-navigation
 *  #1127, #335, #1715,
 */

import React, { PureComponent } from 'react';
import { DrawerNavigator, TabNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { fetchAlgoliaKeys } from 'kitsu/store/app/actions';
import { fetchNotifications } from 'kitsu/store/feed/actions';
import { tabRed, listBackPurple } from 'kitsu/constants/colors';
import { SidebarScreen } from 'kitsu/screens/Sidebar';

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

const Tabs = TabNavigator(
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
  },
);

const Drawer = DrawerNavigator({
  Tabs: {
    screen: Tabs,
  },
}, {
  contentComponent: SidebarScreen, // Use our own component
  drawerBackgroundColor: listBackPurple,
});

class TabsNav extends PureComponent {
  static propTypes = {
    badge: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchCurrentUser: PropTypes.func.isRequired,
    fetchAlgoliaKeys: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
  };

  state = {
    drawerLockMode: 'unlocked',
  };

  componentWillMount() {
    this.fetchCurrentUser();
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

  onNavigationStateChange = (prevState, currentState) => {
    const current = this._getRouteName(currentState);
    const previous = this._getRouteName(prevState);
    // route changed?
    if (previous !== current) {
      // top-level route?
      if (TOP_LEVEL_ROUTES.includes(current)) {
        this.setState({ drawerLockMode: 'unlocked' });
      } else {
        this.setState({ drawerLockMode: 'locked-closed' });
      }
    }
  };

  _getRouteName(state) {
    if (!state) return null;
    const route = state.routes[state.index];
    if (route.routes) {
      return this._getRouteName(route);
    }
    return route.routeName;
  }

  render() {
    const { navigation: rootNavigation, badge } = this.props;
    const { drawerLockMode } = this.state;
    const props = { rootNavigation, badge, drawerLockMode };
    return (
      <Drawer
        screenProps={props}
        onNavigationStateChange={this.onNavigationStateChange}
      />
    );
  }
}

const mapper = ({ feed }) => ({
  badge: feed.notificationsUnseen,
});

export default connect(mapper, { fetchCurrentUser, fetchAlgoliaKeys, fetchNotifications })(TabsNav);
