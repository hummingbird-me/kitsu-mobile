import { TabNavigator, StackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';

const Tabs = TabNavigator({
  Feed: {
    screen: HomeScreen,
  },
  Search: {
    screen: HomeScreen,
  },
});

// const Onboarding = StackNavigator({

// })

const Root = StackNavigator({
  Tabs: {
    screen: Tabs,
  },
  // Onboarding: {
  //   screen: Onboarding,
  // },
  // Settings: {
  //   screen: Settings,
  // },
});

export default Root;
