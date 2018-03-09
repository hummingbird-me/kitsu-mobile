import { StackNavigator } from 'react-navigation';
import Feed from 'kitsu/screens/Feed';
import navigationOptions from './navigationOptions';
import { commonRoutes } from './common';

const PostStack = StackNavigator(
  {
    Feed: {
      screen: Feed,
    },
    ...commonRoutes,
  },
  {
    navigationOptions: navigationOptions(),
  },
);

export default PostStack;
