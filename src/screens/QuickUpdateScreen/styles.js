import { StyleSheet, Platform } from 'react-native';
import { isX, paddingX } from 'app/utils/isX';
import * as colors from 'app/constants/colors';
import { statusBarHeight } from 'app/constants/app';

const styles = StyleSheet.create({
  loadingWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.listBackPurple,
  },
  wrapper: {
    flexGrow: 1,
    backgroundColor: colors.listBackPurple,
  },
  xWrapper: {
    paddingTop: statusBarHeight + (isX ? paddingX : 0),
  },
  emptyStateContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateButton: {
    marginVertical: 14,
    backgroundColor: colors.green,
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateButtonText: {
    color: colors.white,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  faderCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  header: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.white,
    fontFamily: 'OpenSans_400Regular',
    fontWeight: '700',
    fontSize: 16,
  },
  filterButton: {
    position: 'absolute',
    right: 10,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  carousel: {
    flexGrow: 0,
    zIndex: 5,
  },
  socialContent: {
    flex: 1,
    backgroundColor: colors.listBackPurple,
    zIndex: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.darkGrey,
  },
  discussionTitle: {
    color: 'white',
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
    padding: 16,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  bold: {
    fontWeight: 'bold',
  },
  unstartedWrapper: {},
  statusWrapper: {
    marginTop: 4,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkPurple,
  },
  statusTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.white,
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
    margin: 4,
    width: 240,
  },
  statusText: {
    width: 240,
    fontSize: 12,
    color: colors.lightGrey,
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
    margin: 4,
  },
  statusImage: {
    marginTop: 16,
    width: 140,
    height: 160,
    resizeMode: 'contain',
  },
});

export default styles;
