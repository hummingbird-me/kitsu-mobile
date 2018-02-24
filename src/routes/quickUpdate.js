import * as React from 'react';
import { Image, Platform } from 'react-native';

import QuickUpdateScreen from 'kitsu/screens/QuickUpdateScreen';
import ProfilePages from 'kitsu/screens/Profiles/ProfilePages';
import PostDetails from 'kitsu/screens/Feed/pages/PostDetails';
import DismissableStackNavigator from 'kitsu/components/DismissableStackNavigator';
import quickUpdateTabBarImage from 'kitsu/assets/img/tabbar_icons/update.png';
import navigationOptions from './navigationOptions';

const QuickUpdateStack = DismissableStackNavigator(
  {
    QuickUpdate: {
      screen: QuickUpdateScreen,
    },
    ProfilePages: {
      screen: ProfilePages,
    },
    // @TODO: Handle all the sub-profile pages, should work on an easier way than c/p.
    PostDetails: {
      screen: PostDetails,
    },
  },
  {
    navigationOptions: () => ({
      ...navigationOptions(50, Platform.select({ ios: -10, android: 20 })),
      header: null,
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <Image source={quickUpdateTabBarImage} style={{ tintColor, width: 24, height: 24 }} />
      ),
    }),
  },
);

export default QuickUpdateStack;
