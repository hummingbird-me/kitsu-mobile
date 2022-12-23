import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

const styles = StyleSheet.create({
  statusWrapper: {
    marginTop: 4,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkPurple,
  },
  statusTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.white,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    margin: 4,
    width: 240,
  },
  statusText: {
    width: 240,
    fontSize: 12,
    color: colors.lightGrey,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    margin: 4,
  },
  statusImage: {
    marginTop: 16,
    width: 140,
    height: 160,
    resizeMode: 'contain',
  },
});

export default styles;
