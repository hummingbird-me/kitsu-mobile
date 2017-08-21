import { StackNavigator } from 'react-navigation';
import SearchScreen from 'kitsu/screens/Search/AlgoSearchScreen';
import SearchCategory from 'kitsu/screens/Search/SearchCategory';
import SearchResults from 'kitsu/screens/Search/SearchResults';
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
    navigationOptions: navigationOptions(),
  },
);

export default SearchStack;
