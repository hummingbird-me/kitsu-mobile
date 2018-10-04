import {
  CreateAccountScreen,
  SelectAccountScreen,
  WelcomeScreen,
  RateScreen,
  FavoritesScreen,
  ManageLibrary,
  RatingSystemScreen,
  ImportLibrary,
  ImportDetail,
} from 'kitsu/screens/Onboarding/';

import * as Screens from 'kitsu/navigation/types';

export default onboardingRoutes = {
  [Screens.ONBOARDING_WELCOME]: WelcomeScreen,
  [Screens.ONBOARDING_CREATE_ACCOUNT]: CreateAccountScreen,
  [Screens.ONBOARDING_SELECT_ACCOUNT]: SelectAccountScreen,
  [Screens.ONBOARDING_RATE_SCREEN]: RateScreen,
  [Screens.ONBOARDING_FAVORITES_SCREEN]: FavoritesScreen,
  [Screens.ONBOARDING_MANAGE_LIBRARY]: ManageLibrary,
  [Screens.ONBOARDING_IMPORT_LIBRARY]: ImportLibrary,
  [Screens.ONBOARDING_IMPORT_DETAIL]: ImportDetail,
  [Screens.ONBOARDING_RATING_SYSTEM]: RatingSystemScreen,
};
