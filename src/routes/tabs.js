import React from 'react';
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

class TabsNav extends React.PureComponent {
  static propTypes = {
    badge: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchCurrentUser: PropTypes.func.isRequired,
    fetchAlgoliaKeys: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
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
  }

  render() {
    return (
      <Drawer
        screenProps={{ rootNavigation: this.props.navigation, badge: this.props.badge }}
      />
    );
  }
}

const mapper = ({ feed }) => ({
  badge: feed.notificationsUnseen,
});

export default connect(mapper, { fetchCurrentUser, fetchAlgoliaKeys, fetchNotifications })(TabsNav);
