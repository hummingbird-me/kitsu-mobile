import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple,
    flex: 1,
  },
  noticeContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
    backgroundColor: colors.white,
    marginBottom: 6,
    position: 'relative',
  },
  noticeText: {
    fontWeight: '600',
    fontFamily: 'Open Sans',
    paddingVertical: 10,
  },
  actionButton: {
    backgroundColor: colors.green,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonText: {
    color: colors.white,
  },
  closeIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    color: colors.grey,
    fontSize: 18,
  },
  outerText: {
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  innerText: {
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '600',
  },
  parentItem: {
    flexDirection: 'row',
    backgroundColor: colors.offWhite,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  itemSeperator: {
    borderWidth: 1,
    borderColor: colors.darkPurple,
  },
  iconContainer: { justifyContent: 'center', paddingLeft: 5, paddingRight: 10, width: 25 },
  icon: { fontSize: 8, color: '#FF102E' },
  detailsContainer: { alignItems: 'center', flexDirection: 'row', flex: 1 },
  userAvatar: { width: 32, height: 32, borderRadius: 16 },
  activityContainer: { flex: 1, justifyContent: 'center' },
  activityTextContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  activityText: { fontFamily: 'OpenSans', fontSize: 12, fontWeight: '400' },
  activityTextHighlight: { color: '#FF300A', fontWeight: '500' },
  activityMetaContainer: { justifyContent: 'flex-start' },
  activityMetaText: { fontSize: 10, color: '#919191' },
});
