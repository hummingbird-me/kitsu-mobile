import {
  useNavigation as _useNavigation,
  useRoute as _useRoute,
  type CompositeScreenProps,
} from '@react-navigation/native';
import {
  TransitionPresets,
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';

import { kitsuPurple } from '@/constants/palette';
import Intro from '@/screens/Landing/Intro';

import { type RootNavigatorScreenProps } from '../../Root';

export type LandingNavigatorParamList = {
  Intro: undefined;
  Auth: { tab: 'sign-in' | 'sign-up' };
  Legal: { tab: 'terms-of-service' | 'privacy-policy' };
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
      <Stack.Screen name="Auth" component={() => <Text>Hewwo</Text>} />
      <Stack.Screen name="Legal" component={() => <Text>Terms</Text>} />
    </Stack.Navigator>
  );
}
