import React from 'react';

import UrqlContextProvider from './UrqlContext';

const ApplicationContext: React.FC<{ children: React.ReactNode }> = function ({
  children,
}) {
  return <UrqlContextProvider>{children}</UrqlContextProvider>;
};
export default ApplicationContext;
