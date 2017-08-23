import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
  },
  text: {
    marginHorizontal: 14,
    marginVertical: 2,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    fontSize: 13,
    color: colors.white,
  },
});
