import { StyleSheet, Platform } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  progressWrap: {
    paddingVertical: scenePadding,
    backgroundColor: colors.listBackPurple,
  },
  progressContainer: {
    backgroundColor: colors.white,
    marginHorizontal: scenePadding,
    padding: 8,
    marginVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStatus: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 16,
    alignItems: 'center',
  },
  progressBarBackground: {
    backgroundColor: colors.lightGrey,
  },

  progressIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressIconCircle__completed: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  progressIcon: {
    fontSize: 28,
    backgroundColor: 'transparent',
    paddingTop: Platform.select({ ios: 4, android: 0 }),
  },
  arrowIcon: {
    fontSize: 20,
    marginLeft: 10,
    color: colors.lightGrey,
  },
});
