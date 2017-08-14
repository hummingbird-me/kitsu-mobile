import { StackNavigator } from 'react-navigation';
import SearchFilter from '../screens/Search/SearchFilter';
import FilterSub from '../screens/Search/FilterSub';
import SearchCategory from '../screens/Search/SearchCategory';
import { darkPurple, white } from '../constants/colors';

const FilterStack = StackNavigator(
  {
    Filter: {
      screen: SearchFilter,
    },
    FilterCategory: {
      screen: SearchCategory,
    },
    FilterSub: {
      screen: FilterSub,
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
        marginTop: -10,
      },
    },
  },
);

export default FilterStack;
