import { type NavigatorScreenParams } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';

import { useSession } from '@/contexts/SessionContext';

import Landing, { type LandingNavigatorParamList } from './Landing';
import Main, { type MainNavigatorParamList } from './Main';

export type RootNavigatorParamList = {
  Landing: NavigatorScreenParams<LandingNavigatorParamList>;
  Main: NavigatorScreenParams<MainNavigatorParamList>;
};

export type RootNavigatorScreenProps<
  Route extends keyof RootNavigatorParamList
> = NativeStackScreenProps<RootNavigatorParamList, Route>;

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

export default function RootNavigator() {
  const session = useSession();

  return (
    <Stack.Navigator
      initialRouteName={session?.loggedIn ? 'Main' : 'Landing'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Main" component={Main} />
    </Stack.Navigator>
  );
}
