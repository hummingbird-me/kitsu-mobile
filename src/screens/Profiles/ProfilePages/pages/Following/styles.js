import { StyleSheet } from 'react-native';
import { isX, paddingX } from 'kitsu/utils/isX';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  headerCoverImage: {
    height: isX ? 150 + paddingX : 150,
    justifyContent: 'center',
  },
  userContainer: {
    height: isX ? 225 + paddingX : 225,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 12,
  },
  userProfileContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: -40,
    flexDirection: 'row',
  },
  userProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'white',
  },
  userProfileTextWrapper: {
    marginLeft: 12,
    marginTop: 10,
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
