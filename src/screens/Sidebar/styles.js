import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.listBackPurple,
    paddingTop: Platform.select({ ios: 77, android: 72 }),
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
    // TODO: Find a better name for this and remove margin to generalize more.
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
    borderRadius: 2,
    margin: 12,
  },
  privacySettingsWrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacySettingsText: {
    fontFamily: 'OpenSans',
    color: colors.softBlack,
    fontSize: 14,
  },
  privacyTipsWrapper: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  privacyTipsText: {
    fontSize: 10,
    color: 'grey',
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 40,
    padding: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontWeight: '500',
    color: colors.activeRed,
  },
  userProfileButton: {
    marginTop: 12,
    marginHorizontal: 12,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userProfileTextWrapper: {
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  userProfileName: {
    fontFamily: 'OpenSans',
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  userProfileDetailsText: {
    fontFamily: 'OpenSans',
    color: colors.white,
    fontSize: 10,
  },
});

export const flatten = (...additionalStyles) => {
  const includedStyles = additionalStyles.map(style => styles[style]);
  return StyleSheet.flatten(includedStyles);
};
