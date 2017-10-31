import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    paddingTop: 20,
    backgroundColor: colors.listBackPurple,
  },
  modalButton: {
    flex: 1,
  },
  modalRightButton: {
    alignItems: 'flex-end',
  },
  modalTitle: {
    flex: 2,
    alignItems: 'center',
  },

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
