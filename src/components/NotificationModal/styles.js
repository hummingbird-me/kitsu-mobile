import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: colors.transparent,
  },
  modalContent: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.listBackPurple,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(46, 34, 45)',
  },
  modalText: {
    color: colors.white,
    fontWeight: '700',
    fontFamily: 'OpenSans',
    fontSize: 14,
    margin: 10,
  },
});
