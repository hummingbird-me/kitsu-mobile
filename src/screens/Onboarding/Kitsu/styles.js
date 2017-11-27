import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  contentWrapper: {
    flex: 1,
  },
  buttonMedia: {
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    height: 47,
    borderRadius: 8,
  },
  buttonLogo: {
    width: 120,
    height: 30,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: colors.white,
    padding: 2,
    borderRadius: 4,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  cardText: {
    textAlign: 'center',
    paddingHorizontal: 12,
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  cardLogo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    height: 50,
    fontSize: 14,
  },
  importModalTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 14,
  },
  importModalText: {
    textAlign: 'center',
    paddingHorizontal: 12,
    fontFamily: 'OpenSans',
    fontSize: 12,
    marginBottom: 8,
  },
});
