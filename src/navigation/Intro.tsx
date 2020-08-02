import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Intro from 'app/screens/Intro';
import Auth from 'app/screens/Auth/AuthScreen';
import * as colors from 'app/constants/colors';

export type IntroNavigatorParamList = {
  Intro: undefined;
  Auth: { page: 'SIGN_IN' | 'SIGN_UP' };
};

const Stack = createStackNavigator<IntroNavigatorParamList>();

export default function IntroNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.darkPurple, flex: 2 },
      }}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Auth" component={Auth} />
    </Stack.Navigator>
  );
}
