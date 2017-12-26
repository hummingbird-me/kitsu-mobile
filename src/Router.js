import { StackNavigator } from 'react-navigation';
import Routes from './routes';
import { IntroScreen, RegistrationScreen } from './screens/Intro';
import { AuthScreen, RecoveryScreen, SplashScreen } from './screens/Auth';
import navigationOptions from './routes/navigationOptions';

const Root = StackNavigator(
  {
    Splash: {
      screen: SplashScreen,
    },
    Intro: {
      screen: IntroScreen,
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
    Onboarding: {
      screen: Routes.OnboardingStack,
    },
    Tabs: {
      screen: Routes.Tabs,
    },
    TabsNotification: {
      screen: Routes.TabsNotification,
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
