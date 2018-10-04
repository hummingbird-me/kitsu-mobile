import Feed from 'kitsu/screens/Feed';
import PostDetails from 'kitsu/screens/Feed/pages/PostDetails';
import CreatePost from 'kitsu/screens/Feed/pages/PostCreation/CreatePost';

import * as Screens from 'kitsu/navigation/types';

export default feedRoutes = {
  [Screens.FEED]: Feed,
  [Screens.FEED_POST_DETAILS]: PostDetails,
  [Screens.FEED_CREATE_POST]: CreatePost,
};
