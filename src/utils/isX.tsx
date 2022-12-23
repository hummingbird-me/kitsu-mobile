import { Dimensions, Platform } from 'react-native';

// See https://mydevice.io/devices/ for device dimensions
const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

// The top inset is 44 (24 + status bar height)
// However we subtract the status bar height in this
export const safeAreaInsetX = { top: 24, bottom: 34 };
export const paddingX = safeAreaInsetX.top;

export const isX = (() => {
  if (Platform.OS === 'web') return false;

  const X =
    (D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
    (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT);
  const XSMAX =
    (D_HEIGHT === XSMAX_HEIGHT && D_WIDTH === XSMAX_WIDTH) ||
    (D_HEIGHT === XSMAX_WIDTH && D_WIDTH === XSMAX_HEIGHT);

  return Platform.OS === 'ios' && (X || XSMAX);
})();
