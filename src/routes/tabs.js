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
class DrawerWrapper extends Component {
  static propTypes = {
    initialPage: PropTypes.bool,
  }

  static defaultProps = {
    initialPage: null,
  }

  shouldComponentUpdate(nextProps) {
    return isNull(this.props.initialPage) && !isNull(nextProps.initialPage);
  }

  render() {
    const { initialPage, ...otherProps } = this.props;
    const Wrapper = Drawer(initialPage);
    return (
      <Wrapper
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

  state = {
    drawerLockMode: 'unlocked',
  };

  componentWillMount() {
    this.fetchCurrentUser();
    this.props.fetchAlgoliaKeys();
  }

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

  fetchCurrentUser = async () => {
    try {
      await this.props.fetchCurrentUser();
      this.props.fetchNotifications();
    } catch (e) {
      console.warn(e);
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
    const { navigation: rootNavigation, badge, initialPage } = this.props;
    const { drawerLockMode } = this.state;
    const props = { rootNavigation, badge, drawerLockMode };
    return (
      <DrawerWrapper
        initialPage={initialPage}
        screenProps={props}
        onNavigationStateChange={this.onNavigationStateChange}
      />
    );
  }
}

const mapper = ({ feed, app }) => ({
  badge: feed.notificationsUnseen,
  initialPage: app.initialPage,
});

export default connect(mapper, { fetchCurrentUser, fetchAlgoliaKeys, fetchNotifications })(TabsNav);
