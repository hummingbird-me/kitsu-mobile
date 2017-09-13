import { StyleSheet } from 'react-native';
import { flattenCommon } from 'kitsu/common/styles';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple,
    flex: 1,
  },
  listHeader: {
    ...flattenCommon('centerCenter'),
    flexDirection: 'row',
    backgroundColor: colors.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  listHeaderText: {
    ...flattenCommon('text', 'textHeavy'),
    color: colors.grey,
    fontSize: 10,
    paddingVertical: 8,
  },
  searchBoxStyle: {
    marginVertical: 10,
  },
});
