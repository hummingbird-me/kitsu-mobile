import { StyleSheet, Platform } from 'react-native';
import * as colors from 'app/constants/colors';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.listBackPurple,
  },
  webView: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: 'OpenSans_400Regular',
  },
});
