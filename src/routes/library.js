import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import library from 'kitsu/assets/img/tabbar_icons/library.png';
import { LibraryScreen } from 'kitsu/screens/Library/LibraryScreen';
import { navigationBarHeight, statusBarHeight } from 'kitsu/constants/app';
import navigationOptions from './navigationOptions';
import { commonRoutes } from './common';

const LibraryStack = StackNavigator({
  LibraryScreen: {
    screen: LibraryScreen,
  },
  ...commonRoutes,
},
{
  navigationOptions: () => ({
    ...navigationOptions(navigationBarHeight + statusBarHeight, statusBarHeight),
    // eslint-disable-next-line react/prop-types
    tabBarIcon: ({ tintColor }) => (
      <Image source={library} style={{ tintColor, width: 21, height: 21 }} />
    ),
  }),
});

export default LibraryStack;
