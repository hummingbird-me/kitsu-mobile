import { useFocusEffect } from '@react-navigation/native';
import {
  createStackNavigator as rnCreateStackNavigator,
  type StackNavigationProp,
  type StackScreenProps,
} from '@react-navigation/stack';
import React, { useCallback, useContext, useMemo } from 'react';

import Placeholder, { usePlaceholder } from '@/components/Placeholder';
import { kitsuPurple } from '@/constants/palette';
import { StackNavigationContext } from '@/contexts/StackNavigationContext';
import DebugScreen from '@/screens/Debug/DebugScreen';

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

const Stack = rnCreateStackNavigator<StackNavigatorParamList>();

export function createStackNavigator({
  initialRouteName,
}: {
  initialRouteName: keyof StackNavigatorParamList;
}) {
  // We know the name isn't useStackNavigator but our name is better :)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(
    () =>
      Object.defineProperty(
        () => <StackNavigator initialRouteName={initialRouteName} />,
        'name',
        { value: `StackNavigator<${initialRouteName}>` }
      ),
    [initialRouteName]
  );
}

function FocusWrapper({
  children,
  navigation,
}: {
  children: React.ReactNode;
  navigation: StackNavigationProp<StackNavigatorParamList>;
}) {
  // Update the navigation ref when focused stack changes
  const ref = useContext(StackNavigationContext);
  useFocusEffect(
    useCallback(() => {
      ref.current = navigation;
    }, [ref, navigation])
  );

  return children;
}

export default function StackNavigator({
  initialRouteName,
}: {
  initialRouteName: keyof StackNavigatorParamList;
}) {
  return (
    <Stack.Navigator
      // @ts-expect-error The layout is not given the narrower type definition :/
      layout={FocusWrapper}
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
      <Stack.Screen name="Debug" component={DebugScreen} />
      <Stack.Screen name="Profile" component={usePlaceholder('Profile')} />
      <Stack.Screen name="Library" component={usePlaceholder('Library')} />
    </Stack.Navigator>
  );
}
