import { TabNavigator, StackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/Onboarding/OnboardingScreen';
import { LoginScreen, SignupScreen, RecoveryScreen, SplashScreen } from './screens/Auth';
import { SearchScreen, SearchCategory, SearchResults } from './screens/Search';
import NotificationsScreen from './screens/Notifications/NotificationsScreen';
import * as colors from './constants/colors';

const SearchStack = StackNavigator(
  {
    SearchAll: {
      screen: SearchScreen,
    },
    SearchCategory: {
      screen: SearchCategory,
    },
    SearchResults: {
      screen: SearchResults,
    },
  },
  {
    navigationOptions: {
      headerStyle: { backgroundColor: colors.darkPurple, height: 63 },
      headerTitleStyle: {
        color: colors.white,
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: -10,
      },
    },
  },
);

const NotifStack = StackNavigator(
  {
    Notifications: {
      screen: NotificationsScreen,
    },
  },
  {
    navigationOptions: {
      headerStyle: { backgroundColor: colors.darkPurple, height: 63 },
      headerTitleStyle: {
        color: colors.white,
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: -10,
      },
    },
  },
);

const Tabs = TabNavigator(
  {
    Search: {
      screen: SearchStack,
    },
    Feed: {
      screen: HomeScreen,
    },
    Notif: {
      screen: NotifStack,
    },
  },
  {
    tabBarOptions: {
      activeTintColor: colors.tabRed,
      showLabel: false,
      style: { height: 44 },
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
  {
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      headerStyle: { backgroundColor: colors.darkPurple, height: 63 },
      headerTitleStyle: {
        color: colors.white,
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: -10,
      },
    },
  },
);

export default Root;
