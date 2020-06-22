import { LibraryScreen } from 'app/screens/Library/LibraryScreen';
import { LibrarySearch } from 'app/screens/Library/LibrarySearch';
import { UserLibraryEditScreen } from 'app/screens/Profiles';

import * as Screens from 'app/navigation/types';

export default libraryRoutes = {
  [Screens.LIBRARY]: LibraryScreen,
  [Screens.LIBRARY_SEARCH]: LibrarySearch,
  [Screens.LIBRARY_ENTRY_EDIT]: UserLibraryEditScreen,
};
