import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX, safeAreaInsetX } from 'kitsu/utils/isX';

export const styles = StyleSheet.create({
  imageModalFooterContainer: {
    bottom: 44.96 + (isX ? safeAreaInsetX.bottom : 0),
    position: 'relative',
  },
  imageModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 44.96,
  },
  icon: {
    color: colors.white,
    marginHorizontal: 8,
    fontSize: Platform.select({ ios: 30, android: 28 }),
    backgroundColor: 'transparent',
  },
  closeIcon: {
    fontSize: Platform.select({ ios: 36, android: 28 }),
  },
  openIcon: {
    fontSize: 28,
  },
  iconContainer: {
    height: '100%',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
