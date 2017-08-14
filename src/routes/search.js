import { StackNavigator } from 'react-navigation';
import SearchScreen from '../screens/Search/SearchScreen';
import SearchCategory from '../screens/Search/SearchCategory';
import SearchResults from '../screens/Search/SearchResults';
import { darkPurple, white } from '../constants/colors';

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
    navigationOptions: {
      headerStyle: { backgroundColor: darkPurple, height: 64 },
      headerTitleStyle: {
        color: white,
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 0,
      },
    },
  },
);

export default SearchStack;
