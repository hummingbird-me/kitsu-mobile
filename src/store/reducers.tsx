import { animeReducer as anime } from './anime/reducer';
import { appReducer as app } from './app/reducer';
import { authReducer as auth } from './auth/reducer';
import { feedReducer as feed } from './feed/reducer';
import { groupsReducer as groups } from './groups/reducer';
import { mediaReducer as media } from './media/reducer';
import { onboardingReducer as onboarding } from './onboarding/reducer';
import { profileReducer as profile } from './profile/reducer';
import { userReducer as user } from './user/reducer';
import { usersReducer as users } from './users/reducer';

export {
  app,
  auth,
  onboarding,
  user,
  anime,
  feed,
  profile,
  media,
  users,
  groups,
};
