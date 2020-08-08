import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Intro from './Intro';
import ProfileDrawer from './ProfileDrawer';
import { useSession } from 'app/contexts/SessionContext';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const session = useSession();

  return (
    <Stack.Navigator
      initialRouteName={session?.loggedIn ? 'ProfileDrawer' : 'Intro'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="ProfileDrawer" component={ProfileDrawer} />
    </Stack.Navigator>
  );
}
