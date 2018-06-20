import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX, paddingX } from 'kitsu/utils/isX';
import { navigationBarHeight, statusBarHeight } from 'kitsu/constants/app';

export const createPostStyles = StyleSheet.create({
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
  actionBarIcons: {
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBarIcon: {
    fontSize: 18,
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
  actionModalIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
  },
  actionModalIcon: {
    fontSize: 18,
    alignItems: 'center',
  },
});

export const mediaItemStyles = StyleSheet.create({
  container: {
    // padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    paddingRight: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    borderRadius: 4,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  icon: {
    color: colors.lightGrey,
    fontSize: 18,
  },
  image: {
    width: 60,
    height: 90,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
  },
  image_episode: {
    borderBottomLeftRadius: 0,
  },
  episodeTag: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    padding: 4,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const gifImageStyles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    minHeight: 100,
  },
  iconContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  icon: {
    color: colors.white,
    fontSize: 14,
  },
});
