import DismissableStackNavigator from '../components/DismissableStackNavigator';
import {
  MediaScreen,
  CustomLibScreen,
  ProfileScreen,
  FavoriteCharacters,
  NetworkScreen,
  FavoriteMedia,
} from '../screens/Profiles';
import { darkPurple, white } from '../constants/colors';

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
      screen: CustomLibScreen,
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
    navigationOptions: {
      headerStyle: { backgroundColor: darkPurple, height: 50 },
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

export default ProfileStack;
