import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';
import { scenePadding } from 'app/screens/Feed/constants';

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  postFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGrey,
    backgroundColor: colors.offWhite,
  },
  postReplyBanner: {
    backgroundColor: colors.lightestGrey,
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  postSection: {
    padding: scenePadding,
  },
  postCommentsSection: {
    padding: scenePadding,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGrey,
    backgroundColor: colors.offWhite,
  },
});
