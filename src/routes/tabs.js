import React from 'react';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import HomeScreen from 'kitsu/screens/HomeScreen';
import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { tabRed, listBackPurple } from 'kitsu/constants/colors';
import SearchStack from './search';
import NotifStack from './notification';
import FeedStack from './feed';
import SidebarStack from './sidebar';

const Tabs = TabNavigator(
  {
    Feed: {
      screen: FeedStack,
    },
    // Profile: {
    //   screen: ProfileStack,
    // },
    Search: {
      screen: SearchStack,
    },
    Home: {
      screen: HomeScreen,
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
    tabBarOptions: {
      activeTintColor: tabRed,
      inactiveBackgroundColor: listBackPurple,
      activeBackgroundColor: listBackPurple,
      showLabel: false,
      style: {
        height: 44.96,
        borderTopWidth: 0,
      },
      backgroundColor: listBackPurple,
    },
  },
);

class TabsNav extends React.PureComponent {
  componentWillMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    return <Tabs />;
  }
}

const mapper = () => ({});

export default connect(mapper, { fetchCurrentUser })(TabsNav);
