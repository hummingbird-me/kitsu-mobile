import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX, safeAreaInsetX } from 'kitsu/utils/isX';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
    paddingTop: 77 + Platform.select({ ios: 0, android: 4 }),
    paddingBottom: isX ? safeAreaInsetX.bottom : 0,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  rowWrapper: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    backgroundColor: colors.transparent,
  },
  rowSelected: {
    backgroundColor: colors.white,
  },
  rowRating: {
    paddingHorizontal: 14,
    minHeight: 58,
    borderRadius: 8,
  },
  text: {
    color: colors.white,
    fontFamily: 'OpenSans',
    fontWeight: '600',
  },
  textSelected: {
    color: colors.darkPurple,
  },
  tutorialText: {
    marginVertical: 16,
    color: colors.white,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  button: {
    marginHorizontal: 0,
  },
  buttonSecondary: {
    backgroundColor: colors.transparent,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
  },
  buttonTitleStyle: {
    fontWeight: '600',
  },
  buttonSecondaryTitle: {
    fontWeight: '600',
    color: colors.grey,
  },
  imageSimple: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginHorizontal: 2,
  },
  imageRegular: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginHorizontal: 2,
  },
  imageAdvanced: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginHorizontal: 2,
  },
  pillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 4,
    marginTop: 12,
  },
});
