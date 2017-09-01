import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.listBackPurple,
    paddingTop: 77,
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
