import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Intro from 'app/screens/Intro';
import * as colors from 'app/constants/colors';

const Stack = createStackNavigator();

export default function IntroNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Carousel"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.darkPurple, flex: 2 },
      }}>
      <Stack.Screen name="Intro" component={Intro} />
    </Stack.Navigator>
  );
}
