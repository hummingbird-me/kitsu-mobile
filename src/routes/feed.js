import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Feed from 'kitsu/screens/Feed';
import PostDetails from 'kitsu/screens/Feed/pages/PostDetails';
import CreatePost from 'kitsu/screens/Feed/pages/CreatePost';
import MediaPages from 'kitsu/screens/Profiles/MediaPages';
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
  },
  {
    ...navigationOptions(),
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
    MediaPages: {
      screen: MediaPages,
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
