import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Asap_700Bold } from '@expo-google-fonts/asap';

import Intro from 'app/components/intro';
import BootAnimation from 'app/components/boot-animation';

export default function App() {
  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    Asap_700Bold,
  });
  let [appLoaded, setAppLoaded] = useState(false);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" animated hidden={!fontsLoaded || !appLoaded} />
        {fontsLoaded && <Intro />}
        {!fontsLoaded || !appLoaded ? (
          <BootAnimation onAnimationFinish={() => setAppLoaded(true)} />
        ) : null}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402F3F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
