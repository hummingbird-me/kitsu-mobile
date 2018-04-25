import { StyleSheet, Dimensions } from 'react-native';
import * as colors from 'kitsu/constants/colors';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.listBackPurple,
  },
  videoContainer: {
    backgroundColor: colors.white,
  },
  webContainer: {
    width: Dimensions.get('window').width,
    height: 200
  },
  languageContainer: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  languageButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    backgroundColor: colors.white,
  },
  unitContainer: {
    backgroundColor: colors.white,
    padding: 20,
  },
});
