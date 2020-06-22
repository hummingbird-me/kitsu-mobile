import { StyleSheet, Platform } from 'react-native';
import * as colors from 'app/constants/colors';
import { isX, safeAreaInsetX } from 'app/utils/isX';

export const styles = StyleSheet.create({
  container: {
    marginBottom: isX ? safeAreaInsetX.bottom : 0,
    flex: 1,
  },
  seperator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightestGrey,
  },
  item: {
    paddingBottom: 8,
  },
  itemContainer: {
    padding: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.offWhite,
  },
  item__selected: {
    backgroundColor: colors.green,
  },
  itemUrl: {
    flex: 1,
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  itemUrl__selected: {
    color: colors.white,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.darkGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkmark__selected: {
    backgroundColor: colors.green,
    borderColor: colors.white,
  },
  checkmarkIcon: {
    fontSize: 24,
    backgroundColor: 'transparent',
    paddingTop: Platform.select({ ios: 4, android: 0 }),
  },
});
