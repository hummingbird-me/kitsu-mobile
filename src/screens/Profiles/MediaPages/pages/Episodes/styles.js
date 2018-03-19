import { StyleSheet, Platform } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  itemWrap: {
    padding: scenePadding,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    flex: 1,
    marginLeft: 8,
  },
  progressIconContainer: {
    paddingLeft: 8,
    paddingVertical: 4,
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

  sortingContainer: {
    backgroundColor: colors.listBackPurple,
    justifyContent: 'flex-end',
    padding: 8,
  },
  sortingText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'right',
    textAlignVertical: 'center',
  },
});
