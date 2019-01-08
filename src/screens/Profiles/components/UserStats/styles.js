import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

export const PIE_SIZE = 140;
export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    marginBottom: scenePadding,
    paddingHorizontal: scenePadding,
    paddingVertical: scenePadding,
    flexDirection: 'column',
  },
  main: {
    flexDirection: 'row',
    paddingBottom: scenePadding * 2,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphics: {
    flexDirection: 'row',
  },
  categoryBreakdown: {
    position: 'relative',
    width: PIE_SIZE,
    height: PIE_SIZE
  },
  categoryOverlay: {
    position: 'absolute',
    width: PIE_SIZE,
    height: PIE_SIZE,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: scenePadding * 2,
  },
  timeSpentWrap: {
    overflow: 'hidden',
  },
  timeSpent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 5,
  },
  timeImage: {
    position: 'absolute',
    width: 80,
    height: 76,
    left: -5,
    bottom: -9,
  },
});
