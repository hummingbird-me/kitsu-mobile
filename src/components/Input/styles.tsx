import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: colors.white,
    height: 47,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.white,
  },
  input: {
    height: 40,
    flex: 1,
    marginLeft: 8,
    backgroundColor: colors.white,
    fontSize: 14,
    fontFamily: 'OpenSans',
    color: colors.softBlack,
  },
});
