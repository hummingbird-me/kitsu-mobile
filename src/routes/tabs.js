import React from 'react';
import { Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { fetchAlgoliaKeys } from 'kitsu/store/app/actions';
import { tabRed, listBackPurple } from 'kitsu/constants/colors';
import SearchStack from './search';
import NotifStack from './notification';
import QuickUpdateStack from './quickUpdate';
import FeedStack from './feed';
import SidebarStack from './sidebar';

const Tabs = TabNavigator(
  {
    Feed: {
      screen: FeedStack,
    },
    QuickUpdate: {
      screen: QuickUpdateStack,
    },
    Search: {
      screen: SearchStack,
    },
    Notif: {
      screen: NotifStack,
    },
    Menu: {
      screen: SidebarStack,
    },
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    swipeEnabled: Platform.OS === 'ios',
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
    fetchCurrentUser: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.fetchCurrentUser();
    this.props.fetchAlgoliaKeys();
  }

  render() {
    return <Tabs screenProps={{ rootNavigation: this.props.navigation }} />;
  }
}

const mapper = () => ({});

export default connect(mapper, { fetchCurrentUser, fetchAlgoliaKeys })(TabsNav);
