import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { darkPurple } from 'app/constants/colors';
import Feed from 'app/screens/Feed';

export type HomeNavigatorParamList = {
  Feed: undefined;
};

const Stack = createStackNavigator<HomeNavigatorParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: darkPurple, flex: 2 },
      }}>
      <Stack.Screen name="Feed" component={Feed} />
    </Stack.Navigator>
  );
}
