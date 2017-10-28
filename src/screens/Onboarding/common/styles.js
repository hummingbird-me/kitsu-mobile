import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
    paddingTop: 77 + Platform.select({ ios: 0, android: 4 }),
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tutorialText: {
    marginVertical: 16,
    color: colors.white,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTitleStyle: {
    fontWeight: '600',
  },
});
