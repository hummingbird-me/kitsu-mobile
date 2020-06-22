import * as Screens from 'app/navigation/types';

import { IntroScreen, RegistrationScreen } from 'app/screens/Intro';
import { AuthScreen, RecoveryScreen } from 'app/screens/Auth';

export default authRoutes = {
  [Screens.AUTH_INTRO]: IntroScreen,
  [Screens.AUTH_REGISTRATION]: RegistrationScreen,
  [Screens.AUTH_LOGIN]: AuthScreen,
  [Screens.AUTH_RECOVERY]: RecoveryScreen,
};
