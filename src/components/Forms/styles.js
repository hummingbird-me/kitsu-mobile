import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
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
});
