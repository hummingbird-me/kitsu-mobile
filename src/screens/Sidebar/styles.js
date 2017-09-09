import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
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
  valueText: { // TODO: Find a better name for this.
    fontFamily: 'OpenSans',
    fontSize: 12,
    marginTop: 4,
    color: colors.softBlack,
  },
  linkText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: colors.linkBlue,
  },
  emptyText: {
    marginVertical: 4,
    marginLeft: 13,
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: colors.white,
  },
  inputWrapper: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  input: {
    flex: 1,
    height: 40,
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
  itemImage: {
    resizeMode: 'contain',
    width: 16,
    height: 16,
    marginHorizontal: 4,
  },
  blockingWrapper: {
    backgroundColor: colors.white,
    padding: 2,
    borderRadius: 4,
    margin: 12,
  },
});


export const flatten = (...additionalStyles) => {
  const includedStyles = additionalStyles.map(style => styles[style]);
  return StyleSheet.flatten(includedStyles);
};
