import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.listBackPurple,
    paddingTop: 77,
  },
  headerCoverImage: {
    height: 100,
    justifyContent: 'center',
  },
  hintText: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    color: colors.grey,
  },
  valueText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    marginTop: 4,
    color: colors.darkGrey,
  },
  fieldWrapper: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fieldInput: {
    marginTop: 4,
    height: 30,
    fontFamily: 'OpenSans',
    fontSize: 14,
  },
  selectMenu: {
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  item: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default styles;
