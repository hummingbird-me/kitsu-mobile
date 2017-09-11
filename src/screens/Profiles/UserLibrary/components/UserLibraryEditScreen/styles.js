import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { flattenCommon } from 'kitsu/common/styles';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  dateStarted: {
    flex: 1,
  },
  dateFinished: {
    flex: 1,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.lightGrey,
  },
  deleteEntry: {
    borderBottomWidth: 0,
  },
  editRow: {
    alignItems: 'center',
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 60,
    minHeight: 60,
    padding: 14,
  },
  editRowLabel: {
    ...flattenCommon('text'),
    fontSize: 16,
    fontWeight: '400',
    color: colors.grey,
  },
  editRowValue: {
    ...flattenCommon('text'),
    fontSize: 16,
    fontWeight: '400',
  },
  splitRow: {
    flexDirection: 'row',
  },
  notesSection: {
    flex: 1,
  },
  deleteEntryRow: {
    height: '100%',
    padding: 14,
  },
  deleteEntryText: {
    ...flattenCommon('text'),
    color: colors.red,
  },
  withValueLabel: {
    ...flattenCommon('textSmall'),
    paddingBottom: 4,
  },
});
