import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Feed from 'kitsu/screens/Feed';
import PostDetails from 'kitsu/screens/Feed/pages/PostDetails';
import homeIcon from 'kitsu/assets/img/tabbar_icons/home.png';
import navigationOptions from './navigationOptions';

const FeedStack = StackNavigator(
  {
    Feed: {
      screen: Feed,
    },
    PostDetails: {
      screen: PostDetails,
    },
  },
  {
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
