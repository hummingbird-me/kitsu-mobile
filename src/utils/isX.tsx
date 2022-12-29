import { Platform } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

// The top inset is 44 (24 + status bar height)
// However we subtract the status bar height in this
export const safeAreaInsetX = {
  top: initialWindowMetrics ? initialWindowMetrics.insets.top - 24 : 0,
  bottom: initialWindowMetrics ? initialWindowMetrics.insets.bottom : 0,
};
export const paddingX = safeAreaInsetX.top;

export const isX = (() => {
  if (Platform.OS !== 'ios') return false;
  if (!initialWindowMetrics) return false;

  if (initialWindowMetrics.insets.top > 0) return true;
  if (initialWindowMetrics.insets.bottom > 0) return true;
})();
