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
    flex: 1,
    paddingVertical: 5,
  },
  unitButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 5,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
  },
  unitButton__active: {
    backgroundColor: colors.white,
  },
  metaContainer: {
    backgroundColor: colors.white,
    padding: 15,
  },
});
