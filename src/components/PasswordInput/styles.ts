import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    height: 47,
    marginVertical: 4,
    borderRadius: 8,
  },
  input: {
    backgroundColor: 'transparent',
    flex: 1,
    zIndex: 1,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  eyeIcon: {
    color: colors.darkGrey,
    marginHorizontal: 8,
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  toggle: {
    height: 47,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
