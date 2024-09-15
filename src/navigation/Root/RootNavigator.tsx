import { type NavigatorScreenParams } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';

import { usePlaceholder } from '@/components/Placeholder';
import { useSession } from '@/contexts/SessionContext';

import Landing, { type LandingNavigatorParamList } from './Landing';

export type RootNavigatorParamList = {
  Landing: NavigatorScreenParams<LandingNavigatorParamList>;
  ProfileDrawer: undefined;
};

export type RootNavigatorScreenProps<
  Route extends keyof RootNavigatorParamList
> = NativeStackScreenProps<RootNavigatorParamList, Route>;

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

export default function RootNavigator() {
  const session = useSession();

  return (
    <Stack.Navigator
      initialRouteName={session?.loggedIn ? 'ProfileDrawer' : 'Landing'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen
        name="ProfileDrawer"
        component={usePlaceholder('Profile Drawer')}
      />
    </Stack.Navigator>
  );
}
