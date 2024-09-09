import React from 'react';

import ApplicationContext from '@/contexts';
import RootNavigator from '@/navigation/Root';

export default function App() {
  return (
    <ApplicationContext>
      <RootNavigator />
    </ApplicationContext>
  );
}
