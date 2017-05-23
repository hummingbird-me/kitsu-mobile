import { TabNavigator, StackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/Onboarding/OnboardingScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import SplashScreen from './screens/Auth/SplashScreen';

const Tabs = TabNavigator({
  Feed: {
    screen: HomeScreen,
  },
  Search: {
    screen: HomeScreen,
  },
});

const Root = StackNavigator(
  {
    Splash: {
      screen: SplashScreen,
    },
    Onboarding: {
      screen: OnboardingScreen,
    },
    Login: {
      screen: LoginScreen,
    },
    Tabs: {
      screen: Tabs,
    },
  },
  { headerMode: 'screen', mode: 'modal' },
);

export default Root;
