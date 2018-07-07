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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  icon: {
    color: colors.white,
    marginHorizontal: 8,
    fontSize: Platform.select({ ios: 30, android: 24 }),
    backgroundColor: 'transparent',
  },
  closeIcon: {
    fontSize: Platform.select({ ios: 36, android: 24 }),
  },
  openIcon: {
    fontSize: Platform.select({ ios: 28, android: 24 }),
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
