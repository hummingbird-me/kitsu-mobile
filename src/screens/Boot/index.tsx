import React, { useState, useEffect, FunctionComponent } from 'react';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Asap_700Bold } from '@expo-google-fonts/asap';
import { StatusBar } from 'expo-status-bar';

import BootAnimation from './Animation';

const BootScreen: FunctionComponent<{}> = ({ children }) => {
  let [animationFinished, setAnimationFinished] = useState(false);
  let [booted, setBooted] = useState(false);
  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    Asap_700Bold,
  });

  // Check the boot requirements to see if they've finished loading
  const BOOT_REQUIREMENTS = [fontsLoaded];
  useEffect(() => {
    setBooted(BOOT_REQUIREMENTS.reduce((acc, val) => acc && val, true));
  }, BOOT_REQUIREMENTS);

  return [
    <StatusBar
      style="light"
      animated
      hidden={!fontsLoaded || !animationFinished}
      key="Status Bar"
    />,
    booted ? children : null,
    // Remove the animation when it's finished
    animationFinished ? null : (
      <BootAnimation
        onAnimationFinish={() => setAnimationFinished(true)}
        isBooted={booted}
        key="BootAnimation"
      />
    ),
  ];
};

export default BootScreen;
