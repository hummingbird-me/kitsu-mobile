import * as React from 'react';
import { Image } from 'react-native';

import Feed from 'kitsu/screens/Feed';
import DismissableStackNavigator from 'kitsu/components/DismissableStackNavigator';
import quickUpdateTabBarImage from 'kitsu/assets/img/tabbar_icons/update.png';
import navigationOptions from './navigationOptions';

const QuickUpdateStack = DismissableStackNavigator(
  {
    // TODO: This should be quick update, this is a placeholder.
    FeedActivity: {
      screen: Feed,
    },
  },
  {
    navigationOptions: () => ({
      ...navigationOptions(50, -10),
      header: null,
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <Image source={quickUpdateTabBarImage} style={{ tintColor, width: 24, height: 24 }} />
      ),
    }),
  },
);

export default QuickUpdateStack;
