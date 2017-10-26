import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Feed from 'kitsu/screens/Feed';
import PostDetails from 'kitsu/screens/Feed/pages/PostDetails';
import CreatePost from 'kitsu/screens/Feed/pages/CreatePost';
import MediaPages from 'kitsu/screens/Profiles/MediaPages';
import * as ProfileScreens from 'kitsu/screens/Profiles';
import ProfilePages from 'kitsu/screens/Profiles/ProfilePages';
import homeIcon from 'kitsu/assets/img/tabbar_icons/home.png';
import navigationOptions from './navigationOptions';

const PostStack = StackNavigator(
  {
    FeedActivity: {
      screen: Feed,
    },
    PostDetails: {
      screen: PostDetails,
    },
    MediaPages: {
      screen: MediaPages,
    },
    ProfilePages: {
      screen: ProfilePages,
    },
    UserLibraryEdit: {
      screen: ProfileScreens.UserLibraryEditScreen,
    },
    UserLibraryList: {
      screen: ProfileScreens.UserLibraryListScreen,
    },
    UserLibrarySearch: {
      screen: ProfileScreens.UserLibrarySearchScreen,
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
    headerMode: 'none',
    // eslint-disable-next-line react/prop-types
  },
);

const FeedStack = StackNavigator(
  {
    PostStack: {
      screen: PostStack,
    },
    CreatePost: {
      screen: CreatePost,
    },
  },
  {
    mode: 'modal',
    navigationOptions: () => ({
      ...navigationOptions(),
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <Image source={homeIcon} style={{ tintColor, width: 21, height: 21 }} />
      ),
    }),
  },
);

export default FeedStack;
