import { StackNavigator } from 'react-navigation';
import navigationOptions from './navigationOptions';
import PostCreation from '../screens/PostCreation';

const PostStack = StackNavigator(
  {
    Creation: {
      screen: PostCreation,
    },
  },
  {
    navigationOptions: navigationOptions(),
  },
);

export default PostStack;
