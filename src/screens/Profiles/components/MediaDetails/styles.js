import { StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingTop: scenePadding,
    paddingBottom: scenePadding,
    backgroundColor: colors.white,
  },
  detailRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: scenePadding,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightestGrey,
  },
  detailLabel: {
    width: 100,
  },
  detailContent: {
    flex: 1,
  },
  viewMoreContainer: {
    flex: 1,
    alignItems: 'center',
    padding: scenePadding,
    paddingBottom: 0,
  },
});
