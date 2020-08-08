import React, { useState, useEffect, FunctionComponent } from 'react';
import { StatusBar } from 'expo-status-bar';

import BootAnimation from './Animation';
import loadFonts from 'app/initializers/loadFonts';
import loadSession from 'app/initializers/loadSession';

const BootScreen: FunctionComponent<{}> = ({ children }) => {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [booted, setBooted] = useState(false);

  // Check the boot requirements to see if they've finished loading
  const BOOT_REQUIREMENTS = [loadFonts(), loadSession()];
  useEffect(() => {
    setBooted(BOOT_REQUIREMENTS.reduce((acc, val) => acc && val, true));
  }, BOOT_REQUIREMENTS);

  return (
    <>
      <StatusBar
        style="light"
        animated
        hidden={!booted || !animationFinished}
      />
      {booted ? children : null}
      {animationFinished ? null : (
        <BootAnimation
          onAnimationFinish={() => setAnimationFinished(true)}
          isBooted={booted}
        />
      )}
    </>
  );
};

export default BootScreen;
