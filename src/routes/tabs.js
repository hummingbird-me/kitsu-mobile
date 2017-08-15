import { TabNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import SearchStack from './search';
import NotifStack from './notification';
import ProfileStack from './profile';

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

export default Tabs;
