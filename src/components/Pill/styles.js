import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    margin: 2.5,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  containerSelected: {
    backgroundColor: colors.offBlack,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 12,
    color: colors.white,
    fontFamily: 'OpenSans',
    backgroundColor: 'transparent',
  },
  icon: {
    color: colors.white,
    marginRight: 6,
    fontSize: 18,
    backgroundColor: 'transparent',
  },
});
