import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.listBackPurple,
    flex: 1,
  },
  headerContainer: {
    height: Platform.select({ ios: 77, android: 72 }),
    backgroundColor: colors.listBackPurple,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    elevation: 3,
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
    marginTop: 8,
  },
  settingRow: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingHeader: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    fontWeight: 'normal',
    color: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  customRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGrey,
  },
  hintText: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    color: colors.grey,
  },
  valueText: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    marginTop: 3,
    color: colors.softBlack,
  },
});
