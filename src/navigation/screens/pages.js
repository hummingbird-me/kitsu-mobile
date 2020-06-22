import ProfilePages from 'app/screens/Profiles/ProfilePages';
import MediaPages from 'app/screens/Profiles/MediaPages';
import UnitPage from 'app/screens/Profiles/MediaPages/pages/Episodes/Unit';
import { UserLibraryListScreen } from 'app/screens/Profiles';

import * as Screens from 'app/navigation/types';

export default pageRoutes = {
  [Screens.PROFILE_PAGE]: ProfilePages,
  [Screens.PROFILE_LIBRARY_LIST]: UserLibraryListScreen,
  [Screens.MEDIA_PAGE]: MediaPages,
  [Screens.MEDIA_UNIT_DETAIL]: UnitPage,
};
