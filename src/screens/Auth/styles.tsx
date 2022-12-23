import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX, safeAreaInsetX } from 'kitsu/utils/isX';

export default StyleSheet.create({
  container: {
    paddingBottom: isX ? safeAreaInsetX.bottom : 0,
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  stretch: {
    flex: 1,
  },
  logo: {
    position: 'absolute',
    bottom: Platform.select({ ios: 30, android: 20 }),
    width: 150,
    height: 42,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  tabsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.offBlack,
  },
  tab: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    textAlign: 'center',
    color: colors.transparentWhite,
    fontWeight: 'bold',
  },
  formsWrapper: {
    marginVertical: 8,
  },
  forgotTextWrapper: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  forgotDescription: {
    fontSize: 12,
    color: 'white',
    marginTop: 10,
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  forgotTitle: {
    fontSize: 21,
    color: 'white',
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  dateModalBody: {
    backgroundColor: '#ececec',
  },
});
