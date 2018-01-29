import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';
import { isX, paddingX } from 'kitsu/utils/isX';
import { navigationBarHeight, statusBarHeight } from 'kitsu/constants/app';

export const styles = StyleSheet.create({
  pickerRow: {
    backgroundColor: '#FFFFFF',
    padding: scenePadding,
  },

  pickerIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerIconCircle__isPicked: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },

  pickerIcon: {
    fontSize: 28,
    backgroundColor: 'transparent',
    paddingTop: 4,
  },

  rowPickerSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightGrey,
  },
});
