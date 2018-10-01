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
    backgroundColor: colors.offWhite,
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    flex: 1,
  },
  itemSeperator: {
    borderWidth: 1,
    borderColor: colors.darkPurple,
  },
  iconContainer: { marginLeft: 2, justifyContent: 'center', width: 20 },
  icon: { fontSize: 10, color: '#444' },
  iconUnread: { color: '#f0705a' },
  detailsContainer: { alignItems: 'center', flexDirection: 'row', flex: 1 },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  activityContainer: { flex: 1, justifyContent: 'center', marginLeft: 4 },
  activityTextContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  activityText: { color: '#333', fontFamily: 'OpenSans', fontSize: 12 },
  activityTextHighlight: { fontWeight: 'bold' },
  activityMetaContainer: { justifyContent: 'flex-start' },
  activityMetaText: { fontSize: 11, color: '#919191', fontFamily: 'OpenSans' },
});
