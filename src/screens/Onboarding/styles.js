import { StyleSheet, Dimensions, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  contentWrapper: {
    flex: 1,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '16%',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 34,
    color: 'white',
    fontFamily: 'Asap-Bold',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pageWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  page: {
    height: 360,
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
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedText: {
    color: colors.darkPurple,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
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
});
