import { StyleSheet, Platform } from 'react-native';
import { isX, paddingX } from 'kitsu/utils/isX';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.listBackPurple,
    paddingTop: Platform.select({ ios: 77, android: 72 }),
  },
  headerCoverImage: {
    height: isX ? 150 + paddingX : 150,
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

  sidebarListItem: {
    maxHeight: 38,
  },

  logoutButton: {
    marginTop: 20,
    marginHorizontal: 10,
    backgroundColor: colors.extraDarkPurple,
    width: 120,
  },

  userProfileContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userProfileImage: {
    width: 50,
    height: 50,
  },
  userProfileTextWrapper: {
    marginLeft: 12,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  userProfileName: {
    fontFamily: 'OpenSans',
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const flatten = (...additionalStyles) => {
  const includedStyles = additionalStyles.map(style => styles[style]);
  return StyleSheet.flatten(includedStyles);
};
