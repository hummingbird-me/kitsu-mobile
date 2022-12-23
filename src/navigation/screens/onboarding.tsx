import * as Screens from 'kitsu/navigation/types';
import {
  CreateAccountScreen,
  FavoritesScreen,
  ImportDetail,
  ImportLibrary,
  ManageLibrary,
  RateScreen,
  RatingSystemScreen,
  SelectAccountScreen,
  WelcomeScreen,
} from 'kitsu/screens/Onboarding/';

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
