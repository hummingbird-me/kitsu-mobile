import { Navigation } from 'react-native-navigation';
import * as Screens from './types';


/**
 * Show the modal to create post.
 *
 * @param {*} props Props to pass to the screen
 */
export function showCreatePostModal(props) {
  Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: Screens.FEED_CREATE_POST,
          passProps: props,
        },
      }],
    },
  });
}
