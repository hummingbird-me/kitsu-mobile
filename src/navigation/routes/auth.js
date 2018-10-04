import * as Screens from 'kitsu/navigation/types';

import { IntroScreen, RegistrationScreen } from 'kitsu/screens/Intro';
import { AuthScreen, RecoveryScreen } from 'kitsu/screens/Auth';

export default authRoutes = {
  [Screens.AUTH_INTRO]: IntroScreen,
  [Screens.AUTH_REGISTRATION]: RegistrationScreen,
  [Screens.AUTH_LOGIN]: AuthScreen,
  [Screens.AUTH_RECOVERY]: RecoveryScreen,
};
