import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  pickerButton: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    alignItems: 'flex-start',
  },
  pickerButtonTitle: {
    color: 'grey',
    textAlign: 'left',
    fontSize: 14,
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
  buttonFacebook: {
    borderWidth: 2,
    backgroundColor: colors.transparent,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  termsWrapper: {
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  terms: {
    fontSize: 12,
    color: 'grey',
    fontFamily: 'OpenSans',
  },
  termsHightlight: {
    fontWeight: 'bold',
  },
  forgotButton: {
    padding: 8,
  },
  forgotText: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'center',
    fontFamily: 'OpenSans',
  },
});
