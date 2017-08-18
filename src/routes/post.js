import { StackNavigator } from 'react-navigation';
import PostCreation from 'kitsu/screens/PostCreation';
import MediaUploadScreen from 'kitsu/screens/PostCreation/MediaUploadScreen';
import navigationOptions from './navigationOptions';

const PostStack = StackNavigator(
  {
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
