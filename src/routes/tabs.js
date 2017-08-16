import React from 'react';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import HomeScreen from '../screens/HomeScreen';
import SearchStack from './search';
import NotifStack from './notification';
import ProfileStack from './profile';

import { fetchCurrentUser } from '../store/user/actions';

import { tabRed, listBackPurple } from '../constants/colors';

const Tabs = TabNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Search: {
      screen: SearchStack,
    },
    Profile: {
      screen: ProfileStack,
    },
    // Feed: {
    //   screen: HomeScreen,
    // },
    Notif: {
      screen: NotifStack,
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
