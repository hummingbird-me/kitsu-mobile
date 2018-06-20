import { StyleSheet, Platform } from 'react-native';
import { isX, paddingX } from 'kitsu/utils/isX';
import * as colors from 'kitsu/constants/colors';
import { statusBarHeight } from 'kitsu/constants/app';

const text = {
  color: colors.white,
  fontFamily: 'OpenSans',
  fontSize: 16,
};

const styles = StyleSheet.create({
  header: {
    // Height is different for android because the modal doesn't cover the status bar
    // If it does in the future then the height would be the nav bar height + Status bar height
    height: 60 + (isX ? paddingX : 0) + Platform.select({
      ios: statusBarHeight,
      android: 0,
    }),
    paddingTop: Platform.select({ ios: statusBarHeight, android: 0 }) + (isX ? paddingX : 0),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    // flex: 1,
    ...text,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: '700',
  },
  headerButton: {
    justifyContent: 'center',
  },
  headerButtonText: {
    ...text,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.lightGrey,
    fontWeight: '600',
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  editorWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    overflow: 'hidden',
  },
  editor: {
    ...text,
    color: 'black',
  },
});

export default styles;
