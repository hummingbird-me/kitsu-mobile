import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

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
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
