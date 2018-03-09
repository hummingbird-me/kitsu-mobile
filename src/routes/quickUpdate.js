import * as React from 'react';
import { Platform } from 'react-native';
import FastImage from 'react-native-fast-image';

import QuickUpdateScreen from 'kitsu/screens/QuickUpdateScreen';
import DismissableStackNavigator from 'kitsu/components/DismissableStackNavigator';
import quickUpdateTabBarImage from 'kitsu/assets/img/tabbar_icons/update.png';
import navigationOptions from './navigationOptions';
import { commonRoutes } from './common';

const QuickUpdateStack = DismissableStackNavigator(
  {
    QuickUpdate: {
      screen: QuickUpdateScreen,
    },
    ...commonRoutes,
  },
  {
    navigationOptions: () => ({
      ...navigationOptions(50, Platform.select({ ios: -10, android: 20 })),
      header: null,
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <FastImage source={quickUpdateTabBarImage} style={{ tintColor, width: 24, height: 24 }} />
      ),
    }),
  },
);

export default QuickUpdateStack;
