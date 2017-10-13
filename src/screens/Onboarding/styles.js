import { StyleSheet, Dimensions } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    flex: 2,
  },
  page: {
    justifyContent: 'center',
    height: 320,
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
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  getStartedText: {
    color: colors.darkPurple,
    fontSize: 17,
    fontWeight: 'bold',
  },
  dotContainer: {
    top: -10,
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
  galleryRow: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  squareImage: {
    marginHorizontal: 8,
    width: 130,
    height: 130,
    borderRadius: 8,
  },
  buttonsWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  fbIcon: {
    color: colors.white,
    paddingRight: 8,
    paddingLeft: 8,
  },
});
