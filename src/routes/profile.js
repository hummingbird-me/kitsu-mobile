import DismissableStackNavigator from 'kitsu/components/DismissableStackNavigator';
import {
  MediaScreen,
  UserLibraryScreen,
  UserLibraryListScreen,
  ProfileScreen,
  FavoriteCharacters,
  NetworkScreen,
  FavoriteMedia,
} from 'kitsu/screens/Profiles';
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
    UserLibrary: {
      screen: UserLibraryScreen,
    },
    UserLibraryList: {
      screen: UserLibraryListScreen,
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
