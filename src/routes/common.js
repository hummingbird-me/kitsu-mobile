import PostDetails from 'kitsu/screens/Feed/pages/PostDetails';
import MediaPages from 'kitsu/screens/Profiles/MediaPages';
import * as ProfileScreens from 'kitsu/screens/Profiles';
import ProfilePages from 'kitsu/screens/Profiles/ProfilePages';
import PostCreation from 'kitsu/screens/PostCreation';
import MediaUploadScreen from 'kitsu/screens/PostCreation/MediaUploadScreen';
import { LibrarySearch } from 'kitsu/screens/Library/LibrarySearch';
import { sidebarRoutes } from './sidebar';

export const commonRoutes = {
  Creation: {
    screen: PostCreation,
  },
  MediaUpload: {
    screen: MediaUploadScreen,
  },
  PostDetails: {
    screen: PostDetails,
  },
  MediaPages: {
    screen: MediaPages,
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
  Network: {
    screen: ProfileScreens.NetworkScreen,
  },
  FavoriteCharacters: {
    screen: ProfileScreens.FavoriteCharacters,
  },
  FavoriteMedia: {
    screen: ProfileScreens.FavoriteMedia,
  },
  LibrarySearch: {
    screen: LibrarySearch,
  },
  ...sidebarRoutes,
};
