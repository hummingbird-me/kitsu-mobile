import * as React from 'react';
import { Image } from 'react-native';
import DismissableStackNavigator from 'kitsu/components/DismissableStackNavigator';
import * as ProfileScreens from 'kitsu/screens/Profiles';
import profileTabBarImage from 'kitsu/assets/img/tabbar_icons/update.png';
import navigationOptions from './navigationOptions';

const ProfileStack = DismissableStackNavigator(
  {
    UserProfile: {
      screen: ProfileScreens.ProfileScreen,
    },
    Media: {
      screen: ProfileScreens.MediaScreen,
    },
    Character: {
      screen: ProfileScreens.MediaScreen,
    },
    UserLibrary: {
      screen: ProfileScreens.UserLibraryScreen,
    },
    UserLibraryList: {
      screen: ProfileScreens.UserLibraryListScreen,
    },
    Network: {
      screen: ProfileScreens.NetworkScreen,
    },
    FavoriteCharacters: {
      screen: ProfileScreens.FavoriteCharacters,
    },
    FavoriteMedia: {
      screen: ProfileScreens.FavoriteMedia,
    },
  },
  {
    navigationOptions: () => ({
      ...navigationOptions(50, -10),
      header: null,
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <Image source={profileTabBarImage} style={{ tintColor, width: 24, height: 24 }} />
      ),
    }),
  },
);

export default ProfileStack;
