import { StackNavigator } from 'react-navigation';
import SearchFilter from '../screens/Search/SearchFilter';
import FilterSub from '../screens/Search/FilterSub';
import SearchCategory from '../screens/Search/SearchCategory';
import navigationOptions from './navigationOptions';

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
    navigationOptions: navigationOptions(undefined, -10),
  },
);

export default FilterStack;
