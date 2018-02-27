import { StyleSheet, Dimensions } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    // Force max width as `forceNonDeterministicRendering` on
    // `RecycleListView` will also affect width.
    minWidth: Dimensions.get('window').width,
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
