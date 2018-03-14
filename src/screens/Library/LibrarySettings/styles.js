import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.listBackPurple,
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.listBackPurple,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    zIndex: 2,
  },
  libraryOption: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightPurple,
    height: 40,
  },
  optionSelectedIcon: {
    fontSize: 24,
  },
  settingContainer: {
    paddingVertical: 14,
  },
  settingRow: {
    backgroundColor: colors.white,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingHeader: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  settingText: {
    paddingVertical: 2,
  },
  customRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGrey,
  },
});
