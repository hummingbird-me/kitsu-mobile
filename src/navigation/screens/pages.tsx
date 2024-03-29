import * as Screens from 'kitsu/navigation/types';
import { UserLibraryListScreen } from 'kitsu/screens/Profiles';
import MediaPages from 'kitsu/screens/Profiles/MediaPages';
import UnitPage from 'kitsu/screens/Profiles/MediaPages/pages/Episodes/Unit';
import ProfilePages from 'kitsu/screens/Profiles/ProfilePages';

export default pageRoutes = {
  [Screens.PROFILE_PAGE]: ProfilePages,
  [Screens.PROFILE_LIBRARY_LIST]: UserLibraryListScreen,
  [Screens.MEDIA_PAGE]: MediaPages,
  [Screens.MEDIA_UNIT_DETAIL]: UnitPage,
};
