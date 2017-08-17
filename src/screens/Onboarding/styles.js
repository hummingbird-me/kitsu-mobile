import { StyleSheet } from 'react-native';
import * as colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    opacity: 0.51,
    fontSize: 16,
    color: colors.white,
    fontFamily: 'OpenSans',
  },
  slide: {
    width: 265,
    height: 390,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  text: {
    marginTop: 5,
    color: '#333333',
    fontSize: 17,
    lineHeight: 21,
    fontFamily: 'Asap-Bold',
  },
  desc: {
    padding: 15,
    paddingRight: 25,
    paddingLeft: 25,
    color: '#333333',
    fontSize: 17,
    lineHeight: 21,
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  stepImage: {
    width: 210,
    height: 230,
    marginTop: 30,
    resizeMode: 'contain',
  },
  getStartedBtn: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'OpenSans',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: colors.lightPink,
  },
  stepDotActive: {
    backgroundColor: colors.white,
  },
});
