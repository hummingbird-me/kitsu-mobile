import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },

  postHeader: {
    paddingHorizontal: scenePadding,
    paddingVertical: scenePadding / 2,
  },
  postHeaderBackButton: {
    marginLeft: -scenePadding,
    padding: scenePadding,
  },
  userDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  postMain: {
    paddingHorizontal: scenePadding,
    paddingVertical: scenePadding / 2,
  },

  postImagesView: {
    marginTop: 12,
    marginLeft: scenePadding * -1,
    marginRight: scenePadding * -1,
  },
  postImagesView_noText: {
    marginTop: 0,
  },

  postStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scenePadding / 2,
    marginTop: scenePadding,
  },
  postActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scenePadding,
    marginHorizontal: scenePadding,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGrey,
  },
  postActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  linkStyle: {
    color: colors.orange,
    fontStyle: 'italic',
  },
});
