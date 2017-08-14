import { StackNavigator } from 'react-navigation';
import Routes from './routes';

import OnboardingScreen from './screens/Onboarding/OnboardingScreen';
import { LoginScreen, SignupScreen, RecoveryScreen, SplashScreen } from './screens/Auth';
import { darkPurple, white } from './constants/colors';

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
      screen: Routes.Tabs,
    },
    SearchFilter: {
      screen: Routes.FilterStack,
    },
    Profile: {
      screen: Routes.ProfileStack,
    },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      headerStyle: { backgroundColor: darkPurple, height: 64 },
      headerTitleStyle: {
        color: white,
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: -10,
      },
    },
  },
);

export default Root;
