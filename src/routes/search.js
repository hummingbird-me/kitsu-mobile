import React from 'react';
import { Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { StackNavigator } from 'react-navigation';
import SearchScreen from 'kitsu/screens/Search/SearchScreen';
import SearchCategory from 'kitsu/screens/Search/SearchCategory';
import SearchResults from 'kitsu/screens/Search/SearchResults';
import SeasonScreen from 'kitsu/screens/Search/SeasonScreen';
import search from 'kitsu/assets/img/tabbar_icons/search.png';
import navigationOptions from './navigationOptions';
import { commonRoutes } from './common';

const SearchStack = StackNavigator(
  {
    SearchAll: {
      screen: SearchScreen,
    },
    SearchCategory: {
      screen: SearchCategory,
    },
    SearchResults: {
      screen: SearchResults,
    },
    SeasonScreen: {
      screen: SeasonScreen,
    },
    ...commonRoutes,
  },
  {
    navigationOptions: () => ({
      ...navigationOptions(75, Platform.select({ ios: 0, android: 20 })),
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <FastImage source={search} style={{ tintColor, width: 21, height: 21 }} />
      ),
    }),
  },
);

export default SearchStack;
