import { type CompositeScreenProps } from '@react-navigation/native';
import {
  TransitionPresets,
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import React from 'react';

import { kitsuPurple } from '@/constants/palette';
import AuthScreen, {
  type AuthScreenProps,
} from '@/screens/Landing/Auth/AuthScreen';
import Intro from '@/screens/Landing/Intro';

import { type RootNavigatorScreenProps } from '../../Root';

export type LandingNavigatorParamList = {
  Intro: undefined;
  Auth: AuthScreenProps;
};

export type LandingNavigatorScreenProps<
  Screen extends keyof LandingNavigatorParamList
> = CompositeScreenProps<
  StackScreenProps<LandingNavigatorParamList, Screen>,
  RootNavigatorScreenProps<'Landing'>
>;

const Stack = createStackNavigator<LandingNavigatorParamList>();

export default function LandingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: kitsuPurple[5], flex: 2 },
        ...TransitionPresets.FadeFromBottomAndroid,
      }}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}
