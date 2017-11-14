import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  modalContent: {
    position: 'absolute',
    backgroundColor: colors.listBackPurple,
    left: 0,
    right: 0,
    bottom: 0,
    height: 250,
  },
  modalHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: 46,
    minHeight: 46,
    backgroundColor: colors.listBackPurple,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(46, 34, 45)',
  },
  modalHeaderText: {
    color: colors.white,
    fontWeight: '700',
    fontFamily: 'OpenSans',
    fontSize: 18,
    margin: 10,
  },
  modalCancelButton: {
    color: colors.lightGrey,
  },
  modalDoneButton: {
    color: colors.yellow,
  },
  modalBody: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: colors.listBackPurple,
  },
});
