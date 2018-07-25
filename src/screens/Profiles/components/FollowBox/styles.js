import { StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Feed/constants';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  followBox: {
    paddingHorizontal: scenePadding,
    paddingVertical: scenePadding / 2,
    backgroundColor: '#FFFFFF',
  },
  followBoxBackButton: {
    marginLeft: -scenePadding,
    padding: scenePadding,
  },
  followBoxActions: {
    fontSize: 32,
    paddingVertical: 10,
    paddingLeft: 15,
  },
  userDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  followButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 3,
    height: 30,
    justifyContent: 'center',
    marginRight: 10,
    width: 95,
  },
  unFollowButton: {
    alignItems: 'center',
    backgroundColor: colors.grey,
    borderRadius: 3,
    height: 30,
    justifyContent: 'center',
    marginRight: 10,
    width: 95,
  },
});

