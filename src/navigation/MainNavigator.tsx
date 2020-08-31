import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { placeholderScreen as todo } from 'app/utils/Placeholder';
import LibraryScreen from 'app/screens/Library';
import DebugScreen from 'app/screens/Debug';

export type MainNavigatorParamList = {
  Feed: undefined;
  Search: undefined;
  QuickUpdate: undefined;
  Notifications: undefined;
  Library: undefined;
  Debug: undefined;
};

const Stack = createStackNavigator<MainNavigatorParamList>();

export default function MainNavigator({
  initialRouteName,
}: {
  initialRouteName: keyof MainNavigatorParamList;
}) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Feed"
        component={todo('Feed')}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Search" component={todo('Search')} />
      <Stack.Screen name="QuickUpdate" component={todo('Quick Update')} />
      <Stack.Screen name="Notifications" component={todo('Notifications')} />
      <Stack.Screen name="Debug" component={DebugScreen} />
      <Stack.Screen
        name="Library"
        component={LibraryScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
