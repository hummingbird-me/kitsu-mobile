import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Intro from './Intro';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Intro" component={Intro} />
    </Stack.Navigator>
  );
}
