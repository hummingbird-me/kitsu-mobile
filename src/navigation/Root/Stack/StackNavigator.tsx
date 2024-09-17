import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import React, { useMemo } from 'react';

import { usePlaceholder } from '@/components/Placeholder';
import { kitsuPurple } from '@/constants/palette';

type MediaIdentifier = { id: string; type: 'anime' | 'manga' };

export type StackNavigatorParamList = {
  Feed: { type: 'global' | 'following' };
  Post: { id: string };
  QuickUpdate: { media: MediaIdentifier };
  Media: {
    media: MediaIdentifier;
    tab:
      | 'summary'
      | 'episodes'
      | 'characters'
      | 'staff'
      | 'reactions'
      | 'reviews'
      | 'franchise';
  };
  Reaction: { id: string };
  Profile: {
    id: string;
    tab: 'summary' | 'about' | 'library' | 'groups' | 'reactions' | 'reviews';
  };
  Search: {
    query: string;
    type: 'anime' | 'manga' | 'user';
  };
  Notifications: undefined;
  Library: { userId: string };
  Debug: undefined;
};
export type stackNavigatorScreenProps<T extends keyof StackNavigatorParamList> =
  StackScreenProps<StackNavigatorParamList, T>;

export default function StackNavigator({
  initialRouteName,
}: {
  initialRouteName: keyof StackNavigatorParamList;
}) {
  const Stack = useMemo(
    () => createStackNavigator<StackNavigatorParamList>(),
    []
  );

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerStyle: { backgroundColor: kitsuPurple[5] },
        headerTintColor: kitsuPurple[1],
        cardStyle: { backgroundColor: kitsuPurple[6] },
      }}>
      <Stack.Screen
        name="Feed"
        component={usePlaceholder('Feed')}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Search" component={usePlaceholder('Search')} />
      <Stack.Screen
        name="QuickUpdate"
        component={usePlaceholder('Quick Update')}
      />
      <Stack.Screen
        name="Notifications"
        component={usePlaceholder('Notifications')}
      />
      <Stack.Screen name="Debug" component={usePlaceholder('Debug')} />
      <Stack.Screen name="Profile" component={usePlaceholder('Profile')} />
      <Stack.Screen name="Library" component={usePlaceholder('Library')} />
    </Stack.Navigator>
  );
}
