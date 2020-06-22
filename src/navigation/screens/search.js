import SearchScreen from 'app/screens/Search/SearchScreen';
import SearchCategory from 'app/screens/Search/SearchCategory';
import SearchResults from 'app/screens/Search/SearchResults';
import SeasonScreen from 'app/screens/Search/SeasonScreen';

// Filter
import SearchFilter from 'app/screens/Search/SearchFilter';
import FilterSub from 'app/screens/Search/FilterSub';

import * as Screens from 'app/navigation/types';

export default searchRoutes = {
  [Screens.SEARCH]: SearchScreen,
  [Screens.SEARCH_CATEGORY]: SearchCategory,
  [Screens.SEARCH_RESULTS]: SearchResults,
  [Screens.SEARCH_SEASON]: SeasonScreen,
  [Screens.SEARCH_FILTER]: SearchFilter,
  [Screens.SEARCH_FILTER_SUB]: FilterSub,
};
