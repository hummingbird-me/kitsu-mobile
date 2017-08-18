import DismissableStackNavigator from '../components/DismissableStackNavigator';
import {
  MediaScreen,
  UserLibraryScreen,
  ProfileScreen,
  FavoriteCharacters,
  NetworkScreen,
  FavoriteMedia,
} from '../screens/Profiles';
import navigationOptions from './navigationOptions';

const ProfileStack = DismissableStackNavigator(
  {
    UserProfile: {
      screen: ProfileScreen,
    },
    Media: {
      screen: MediaScreen,
    },
    Character: {
      screen: MediaScreen,
    },
    Library: {
      screen: UserLibraryScreen,
    },
    Network: {
      screen: NetworkScreen,
    },
    FavoriteCharacters: {
      screen: FavoriteCharacters,
    },
    FavoriteMedia: {
      screen: FavoriteMedia,
    },
  },
  {
    navigationOptions: navigationOptions(50, -10),
  },
);

export default ProfileStack;
