import { StyleSheet, Dimensions } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX, safeAreaInsetX } from 'kitsu/utils/isX';

export default StyleSheet.create({
  container: {
    paddingTop: isX ? safeAreaInsetX.top : 0,
    paddingBottom: isX ? safeAreaInsetX.bottom : 0,
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    padding: 4,
  },
  bodyWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  page: {
    justifyContent: 'center',
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    backgroundColor: colors.darkPurple,
  },
  text: {
    marginTop: 5,
    color: colors.white,
    fontSize: 18,
    lineHeight: 21,
    fontFamily: 'Asap-Bold',
  },
  desc: {
    marginTop: 8,
    paddingRight: 25,
    paddingLeft: 25,
    color: colors.white,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  stepContainer: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
  },
  stepImage: {
    width: 210,
    height: 240,
    resizeMode: 'contain',
  },
  getStartedButton: {
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  getStartedText: {
    color: colors.darkPurple,
    fontSize: 17,
    fontWeight: 'bold',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
    backgroundColor: colors.lightPink,
  },
  stepDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  animatedList: {
    marginVertical: 8,
  },
  galleryRow: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  squareImage: {
    marginHorizontal: 8,
    width: 115,
    height: 115,
    borderRadius: 8,
  },
  buttonsWrapper: {
    justifyContent: 'center',
  },
  fbIcon: {
    color: colors.white,
    paddingRight: 8,
    paddingLeft: 8,
  },
  buttonFacebook: {
    backgroundColor: colors.fbBlueDark,
  },
  buttonCreateAccount: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.darkGrey,
  },
  buttonAlreadyAccount: {
    backgroundColor: colors.transparent,
  },
});
