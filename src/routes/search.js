import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import SearchScreen from 'kitsu/screens/Search/SearchScreen';
import SearchCategory from 'kitsu/screens/Search/SearchCategory';
import SearchResults from 'kitsu/screens/Search/SearchResults';
import search from 'kitsu/assets/img/tabbar_icons/search.png';
import navigationOptions from './navigationOptions';

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
  },
  {
    navigationOptions: ({ navigation }) => ({
      ...navigationOptions(),
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <Image source={search} style={{ tintColor, width: 21, height: 21 }} />
      ),
    }),
  },
);

export default SearchStack;
