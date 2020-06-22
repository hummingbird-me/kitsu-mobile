import Feed from 'app/screens/Feed';
import PostDetails from 'app/screens/Feed/pages/PostDetails';
import CreatePost from 'app/screens/Feed/pages/PostCreation/CreatePost';

import * as Screens from 'app/navigation/types';

export default feedRoutes = {
  [Screens.FEED]: Feed,
  [Screens.FEED_POST_DETAILS]: PostDetails,
  [Screens.FEED_CREATE_POST]: CreatePost,
};
