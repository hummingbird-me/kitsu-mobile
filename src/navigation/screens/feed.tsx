import * as Screens from 'kitsu/navigation/types';
import Feed from 'kitsu/screens/Feed';
import CreatePost from 'kitsu/screens/Feed/pages/PostCreation/CreatePost';
import PostDetails from 'kitsu/screens/Feed/pages/PostDetails';

export default feedRoutes = {
  [Screens.FEED]: Feed,
  [Screens.FEED_POST_DETAILS]: PostDetails,
  [Screens.FEED_CREATE_POST]: CreatePost,
};
