import { StackNavigator } from 'react-navigation';
import Routes from './routes';

import { OnboardingScreen, RegistrationScreen } from './screens/Onboarding';
import { AuthScreen, RecoveryScreen, SplashScreen } from './screens/Auth';
import QuickUpdateScreen from './screens/QuickUpdateScreen';
import navigationOptions from './routes/navigationOptions';

const Root = StackNavigator(
  {
    Splash: {
      screen: SplashScreen,
    },
    Onboarding: {
      screen: OnboardingScreen,
    },
    Registration: {
      screen: RegistrationScreen,
    },
    AuthScreen: {
      screen: AuthScreen,
    },
    Recovery: {
      screen: RecoveryScreen,
    },
    Tabs: {
      screen: Routes.Tabs,
    },
    SearchFilter: {
      screen: Routes.FilterStack,
    },
    QuickUpdate: {
      screen: Routes.QuickUpdateStack,
    },
    Post: {
      screen: Routes.PostStack,
    },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: navigationOptions(undefined, -10),
  },
);

export default Root;
