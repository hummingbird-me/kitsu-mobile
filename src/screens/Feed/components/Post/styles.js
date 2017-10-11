import { StyleSheet } from 'react-native';
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

  postMain: {
    paddingHorizontal: scenePadding,
    paddingVertical: scenePadding / 2,
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
  postSection: {
    padding: scenePadding,
  },
});
