import SearchScreen from 'kitsu/screens/Search/SearchScreen';
import SearchCategory from 'kitsu/screens/Search/SearchCategory';
import SearchResults from 'kitsu/screens/Search/SearchResults';
import SeasonScreen from 'kitsu/screens/Search/SeasonScreen';

// Filter
import SearchFilter from 'kitsu/screens/Search/SearchFilter';
import FilterSub from 'kitsu/screens/Search/FilterSub';

import * as Screens from 'kitsu/navigation/types';

export default searchRoutes = {
  [Screens.SEARCH]: SearchScreen,
  [Screens.SEARCH_CATEGORY]: SearchCategory,
  [Screens.SEARCH_RESULTS]: SearchResults,
  [Screens.SEARCH_SEASON]: SeasonScreen,
  [Screens.SEARCH_FILTER]: SearchFilter,
  [Screens.SEARCH_FILTER_SUB]: FilterSub,
};
