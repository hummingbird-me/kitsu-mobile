import { TabNavigator, StackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/Onboarding/OnboardingScreen';

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

const Root = StackNavigator(
  {
    Onboarding: {
      screen: OnboardingScreen,
    },
    Tabs: {
      screen: Tabs,
    },
    // Onboarding: {
    //   screen: Onboarding,
    // },
    // Settings: {
    //   screen: Settings,
    // },
  },
  { headerMode: 'screen' },
);

export default Root;
