import React from 'react';
import { Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { fetchAlgoliaKeys } from 'kitsu/store/app/actions';
import { fetchNotifications } from 'kitsu/store/feed/actions';
import { tabRed, listBackPurple } from 'kitsu/constants/colors';
import SearchStack from './search';
import NotificationsStack from './notification';
import QuickUpdateStack from './quickUpdate';
import FeedStack from './feed';
import SidebarStack from './sidebar';

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
    Menu: {
      screen: SidebarStack,
    },
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: tabRed,
      inactiveBackgroundColor: listBackPurple,
      activeBackgroundColor: listBackPurple,
      showLabel: false,
      showIcon: true,
      style: {
        height: 44.96,
        borderTopWidth: 0,
        backgroundColor: listBackPurple,
      },
      indicatorStyle: {
        backgroundColor: tabRed,
      },
      backgroundColor: listBackPurple,
    },
  },
);

class TabsNav extends React.PureComponent {
  static propTypes = {
    badge: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchCurrentUser: PropTypes.func.isRequired,
    fetchAlgoliaKeys: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.fetchCurrentUser();
    this.props.fetchAlgoliaKeys();
    this.props.fetchNotifications();
  }

  render() {
    return (
      <Tabs screenProps={{ rootNavigation: this.props.navigation, badge: this.props.badge }} />
    );
  }
}

const mapper = ({ feed }) => ({
  badge: feed.notificationsUnseen,
});

export default connect(mapper, { fetchCurrentUser, fetchAlgoliaKeys, fetchNotifications })(TabsNav);
