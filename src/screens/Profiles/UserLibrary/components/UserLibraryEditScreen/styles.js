import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { flattenCommon } from 'kitsu/common/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 666,
  },
  error: {
    backgroundColor: colors.red,
    padding: 6,
  },
  errorText: {
    color: colors.white,
    fontSize: 15,
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
