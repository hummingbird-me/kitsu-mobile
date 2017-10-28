import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  button: {
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: colors.green,
    height: 47,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.buttonDisabledColor,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontFamily: 'OpenSans',
    lineHeight: Platform.select({ ios: 25, android: 20 }),
    fontSize: 15,
  },
  titleBold: {
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 20,
    color: colors.white,
    paddingRight: 8,
    paddingLeft: 8,
  },
});
