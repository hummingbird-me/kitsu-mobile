import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';
import { scenePadding } from 'app/screens/Feed/constants';

const text = {
  color: colors.lightGrey,
  fontFamily: 'OpenSans_400Regular',
  fontSize: 10,
  fontWeight: '800',
};

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightestGrey,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 5,
    padding: scenePadding * 1.5,
  },
  backgroundText: {
    position: 'absolute',
    right: scenePadding,
    ...text,
    fontSize: 26,
  },
  foregroundText: {
    ...text,
    flex: 1,
    textAlign: 'center',
    color: colors.darkGrey,
  },
});
