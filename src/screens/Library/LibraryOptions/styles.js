import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.listBackPurple,
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.darkPurple,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    zIndex: 2,
  },
  libraryOption: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightPurple,
    height: 40,
  },
  optionSelectedIcon: {
    fontSize: 24,
  },
});
