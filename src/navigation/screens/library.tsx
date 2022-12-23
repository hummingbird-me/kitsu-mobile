import * as Screens from 'kitsu/navigation/types';
import { LibraryScreen } from 'kitsu/screens/Library/LibraryScreen';
import { LibrarySearch } from 'kitsu/screens/Library/LibrarySearch';
import { UserLibraryEditScreen } from 'kitsu/screens/Profiles';

export default libraryRoutes = {
  [Screens.LIBRARY]: LibraryScreen,
  [Screens.LIBRARY_SEARCH]: LibrarySearch,
  [Screens.LIBRARY_ENTRY_EDIT]: UserLibraryEditScreen,
};
