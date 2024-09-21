import React from 'react';

import ApplicationContext from '@/contexts';
import RootNavigator from '@/navigation/Root';
import Initializer from '@/screens/BootAnimation/Initializer';

export default function App() {
  return (
    <Initializer>
    <ApplicationContext>
      <RootNavigator />
    </ApplicationContext>
    </Initializer>
  );
}
