import PostDetails from 'kitsu/screens/Feed/pages/PostDetails';
import MediaPages from 'kitsu/screens/Profiles/MediaPages';
import UnitPage from 'kitsu/screens/Profiles/MediaPages/pages/Episodes/Unit';
import * as ProfileScreens from 'kitsu/screens/Profiles';
import ProfilePages from 'kitsu/screens/Profiles/ProfilePages';
import CreatePost from 'kitsu/screens/Feed/pages/PostCreation/CreatePost';
import { LibrarySearch } from 'kitsu/screens/Library/LibrarySearch';
import { sidebarRoutes } from './sidebar';

export const commonRoutes = {
  PostDetails: {
    screen: PostDetails,
  },
  MediaPages: {
    screen: MediaPages,
  },
  CreatePost: {
    screen: CreatePost,
  },
  UnitDetails: {
    screen: UnitPage,
  },
  ProfilePages: {
    screen: ProfilePages,
  },
  UserLibraryEdit: {
    screen: ProfileScreens.UserLibraryEditScreen,
  },
  UserLibraryList: {
    screen: ProfileScreens.UserLibraryListScreen,
  },
  LibrarySearch: {
    screen: LibrarySearch,
  },
  ...sidebarRoutes,
};
