import { TabNavigator, StackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/Onboarding/OnboardingScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import SignupScreen from './screens/Auth/SignupScreen';
import RecoveryScreen from './screens/Auth/RecoveryScreen';
import SplashScreen from './screens/Auth/SplashScreen';
import * as colors from './constants/colors';

const Tabs = TabNavigator(
  {
    Feed: {
      screen: HomeScreen,
    },
    Search: {
      screen: HomeScreen,
    },
    Add: {
      screen: HomeScreen,
    },
    Notifications: {
      screen: HomeScreen,
    },
    Settings: {
      screen: HomeScreen,
    },
  },
  {
    tabBarOptions: {
      activeTintColor: colors.tabRed,
      showLabel: false,
    },
  },
);

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
    Signup: {
      screen: SignupScreen,
    },
    Recovery: {
      screen: RecoveryScreen,
    },
    Tabs: {
      screen: Tabs,
    },
  },
  { headerMode: 'screen', mode: 'modal' },
);

export default Root;
