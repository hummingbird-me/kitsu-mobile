import { StackNavigator } from 'react-navigation';
import Feed from 'kitsu/screens/Feed';
import Post from 'kitsu/screens/Feed/pages/Post';
import PostCreation from 'kitsu/screens/PostCreation';
import MediaUploadScreen from 'kitsu/screens/PostCreation/MediaUploadScreen';
import navigationOptions from './navigationOptions';

const PostStack = StackNavigator(
  {
    Feed: {
      screen: Feed,
    },
    Post: {
      screen: Post,
    },
    Creation: {
      screen: PostCreation,
    },
    MediaUpload: {
      screen: MediaUploadScreen,
    },
  },
  {
    navigationOptions: navigationOptions(),
  },
);

export default PostStack;
