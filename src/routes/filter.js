import { StackNavigator } from 'react-navigation';
import SearchFilter from 'kitsu/screens/Search/SearchFilter';
import FilterSub from 'kitsu/screens/Search/FilterSub';
import SearchCategory from 'kitsu/screens/Search/SearchCategory';
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
    navigationOptions: navigationOptions(),
  },
);

export default FilterStack;
