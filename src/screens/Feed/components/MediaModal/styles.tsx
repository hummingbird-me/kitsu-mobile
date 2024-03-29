import { Platform, StyleSheet } from 'react-native';

import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';
import { isX, safeAreaInsetX } from 'kitsu/utils/isX';

export const styles = StyleSheet.create({
  container: {
    marginBottom: isX ? safeAreaInsetX.bottom : 0,
    flex: 1,
  },
  searchBox: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 2,
    justifyContent: 'center',
  },
  searchBoxContainer: {
    backgroundColor: colors.darkPurple,
  },
  rowPickerSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightGrey,
  },
  pickerRow: {
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  pickerIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  pickerIconCircle__isPicked: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  pickerIcon: {
    fontSize: 28,
    backgroundColor: 'transparent',
    paddingTop: Platform.select({ ios: 4, android: 0 }),
  },
});
