import React, { useState, FunctionComponent } from 'react';
import { StatusBar } from 'expo-status-bar';

import BootAnimation from './Animation';
import isBooted from 'app/initializers';

const BootScreen: FunctionComponent<{}> = ({ children }) => {
  const [animationFinished, setAnimationFinished] = useState(false);
  const booted = isBooted();

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
