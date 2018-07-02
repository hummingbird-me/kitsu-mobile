import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX, paddingX } from 'kitsu/utils/isX';
import { navigationBarHeight, statusBarHeight } from 'kitsu/constants/app';

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  errorContainer: {
    padding: 6,
    backgroundColor: '#CC6549',
  },
  uploadProgressContainer: {
    padding: 6,
    backgroundColor: '#16A085',
  },
  button: {
    margin: 10,
    marginTop: 5,
  },
  checkboxContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // flex: 1,
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    flex: 1,
  },
  checkbox_checked: {
    backgroundColor: colors.green,
  },
  uploadContainer: {
    marginBottom: 10,
  },
  padTop: {
    paddingTop: 10,
  },
  header: {
    height: navigationBarHeight + statusBarHeight + (isX ? paddingX : 0),
    paddingTop: statusBarHeight + (isX ? paddingX : 0),
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.offWhite,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    height: 60,
  },
  actionBarText: {
    padding: 12,
    flex: 1,
    color: colors.softBlack,
  },
  actionBarImages: {
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBarImage: {
    width: 20,
    marginLeft: 10,
  },
  actionModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 2,
  },
  actionModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    backgroundColor: colors.offWhite,
    padding: 12,
  },
  actionModalImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
  },
  actionModalIcon: {
    fontSize: 18,
    alignItems: 'center',
  },
  actionModalCancelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  actionModalCancel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    overflow: 'hidden',
  },
  actionModalCancelIcon: {
    color: 'white',
    fontSize: 20,
    marginRight: 8,
  },
  actionModalCancelText: {
    color: colors.white,
    fontSize: 16,
    margin: 0,
    padding: 0,
    paddingBottom: 2,
  },
  imageSizeContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
