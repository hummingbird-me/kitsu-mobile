import React from 'react';
import { Provider } from 'react-redux';

import store from '@/store/store';

/**
 * @deprecated Redux sucks
 */
export default function ReduxContext({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
