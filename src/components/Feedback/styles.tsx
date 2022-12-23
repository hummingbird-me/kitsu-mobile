import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 12,
    left: 12,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 2,
    zIndex: 99,
  },
  title: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  defaultStyles: {
  },
});
