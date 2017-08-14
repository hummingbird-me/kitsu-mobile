import { StackNavigator } from 'react-navigation';
import SearchScreen from '../screens/Search/SearchScreen';
import SearchCategory from '../screens/Search/SearchCategory';
import SearchResults from '../screens/Search/SearchResults';
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
