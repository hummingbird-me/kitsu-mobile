import { StackNavigator } from 'react-navigation';
import navigationOptions from './navigationOptions';
import PostCreation from '../screens/PostCreation';
import MediaUploadScreen from '../screens/PostCreation/MediaUploadScreen';

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
