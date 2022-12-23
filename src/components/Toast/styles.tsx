import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    backgroundColor: colors.red,
    margin: 16,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  title: {
    color: colors.white,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    flex: 1,
  },
});
