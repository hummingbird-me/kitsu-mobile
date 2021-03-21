import React, { useMemo } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { NavigatorScreenParams } from '@react-navigation/native';

import { placeholderScreen as todo } from 'app/utils/Placeholder';
import {
  Screen as LibraryScreen,
  Params as LibraryParams,
  screenOptions as libraryScreenOptions,
} from 'app/screens/Library';
import DebugScreen from 'app/screens/Debug';
import { purple } from 'app/constants/colors';

export type MainNavigatorParamList = {
  Feed: undefined;
  Search: undefined;
  QuickUpdate: undefined;
  Notifications: undefined;
  Library: LibraryParams;
  Debug: undefined;
};
export type MainNavigatorScreenProps<
  T extends keyof MainNavigatorParamList
> = StackScreenProps<MainNavigatorParamList, T>;

export default function MainNavigator({
  initialRouteName,
}: {
  initialRouteName: keyof MainNavigatorParamList;
}) {
  const Stack = useMemo(
    () => createStackNavigator<MainNavigatorParamList>(),
    []
  );

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        cardStyle: { backgroundColor: purple },
      }}>
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
        options={libraryScreenOptions}
      />
    </Stack.Navigator>
  );
}
