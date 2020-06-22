import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';
import { scenePadding } from 'app/screens/Feed/constants';

export const styles = StyleSheet.create({
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
});
