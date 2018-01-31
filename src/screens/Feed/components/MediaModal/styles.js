import { StyleSheet, Dimensions } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  searchBox: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 2,
    justifyContent: 'center',
  },
  searchBoxContainer: {
    backgroundColor: colors.darkPurple,
  },
  tabBarContainer: {
    paddingVertical: 4,
    backgroundColor: colors.darkPurple,
  },
});
