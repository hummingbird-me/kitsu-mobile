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
  selectedContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
  },
  selectedButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    margin: 10,
    minWidth: 100,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.lightestGrey,
    borderRadius: 4,
    flex: 1,
  },
  back: {
    color: colors.red,
  },
  select: {
    color: colors.green,
  },
  backButton: {
    borderColor: colors.red,
    marginRight: 5,
  },
  selectButton: {
    borderColor: colors.green,
    marginLeft: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    minHeight: 150,
  },
});
