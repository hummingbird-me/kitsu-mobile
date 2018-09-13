import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.listBackPurple,
  },
  headerContainer: {
    height: Platform.select({ ios: 77, android: 72 }),
    backgroundColor: colors.listBackPurple,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    elevation: 3,
    zIndex: 2,
  },
  webView: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: 'Open Sans',
  },
});
