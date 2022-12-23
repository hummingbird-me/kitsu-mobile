import { StyleSheet } from 'react-native';

import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  dateContainer: {
    width: '100%',
    backgroundColor: colors.darkPurple,
  },
  datePicker: {
    backgroundColor: colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
  },
  button: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  confirm: {
    color: colors.yellow,
  },
});
