import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX, paddingX } from 'kitsu/utils/isX';

export const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: colors.transparent,
  },
  modalContent: {
    paddingTop: 20 + (isX ? paddingX : 0),
    paddingHorizontal: 12,
    height: 80 + (isX ? paddingX : 0),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(44, 34, 43, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(46, 34, 45)',
  },
  modalText: {
    color: colors.offWhite,
    fontWeight: '700',
    fontFamily: 'OpenSans',
    fontSize: 12,
    margin: 10,
  },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  activityText: { color: colors.white, fontFamily: 'OpenSans', fontSize: 12 },
  activityTextHighlight: { fontWeight: 'bold', color: colors.tabRed },
});
